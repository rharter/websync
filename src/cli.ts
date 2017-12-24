import * as readLine from 'readline'
import * as minimist from 'minimist'
import * as AWS from 'aws-sdk'
import Websync, { WebsyncOptions, WebsyncTransferProgressEvent } from './Websync'
import Config, { ConfigFile } from './Config'
import progressBar from './utils/progressBar'

const help = `
websync [source] [target] [...options]
websync [...options]

Options:
  -h, --help           Show this message
  -y, --yes            Skip prompts with a "yes" by default
  --region             AWS Region
  --config             Provide a configuration file (js or json)
  --include            Pattern to include
  --exclude            Patter to exclude
  --wildcardPolicy     Set the wildcard policy (majority, minority, or unanmious)
  --wildcardAll        Append wildcard to all invalidations
  --invalidateDeletes  Invalidate delete transfers
`

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const showHelp = () => {
  console.error(help)
  process.exit(1)
}

const prompt = (msg: string): Promise<boolean> => new Promise((resolve, reject) => {
  rl.question(msg, answer => {
    resolve(/^y/i.test(answer))
  })
})

export default async () => {
  const argv = process.argv.slice(2)
  const args = minimist(argv)
  if (args.h || args.help) {
    showHelp()
  }
  const defaultYes = !!args.y || !!args.yes
  const configFileName = args.config || ''
  const config = new Config({
    argv,
    configFileName,
  })
  let options: ConfigFile
  try {
    options = await config.resolve()
  } catch (err) {
    return showHelp()
  }

  if (options.region) {
    AWS.config.update({ region: options.region })
  }

  const progress = progressBar('|:bar| :success :key :time ms')
  const websync = new Websync(options)

  const targetExists = await websync.targetExists()
  if (!targetExists) {
    const shouldCreateTarget = defaultYes || await prompt(
      `The target ${options.target} doesn't exist, would you like to create it? (Y/N)`
    )
    if (!shouldCreateTarget) {
      console.error(`No target container, exiting...`)
      process.exit(1)
    }

    try {
      await websync.ensureTarget()
      console.log(`Created target container: ${options.target}`)
    } catch (err) {
      console.error(`Failed to create target container, exiting...`)
      process.exit(1)
    }
  }

  websync.on('progress', (event: WebsyncTransferProgressEvent) => {
    progress(event.progress, {
      success: 'TODO',
      key: event.item.key,
      time: `${event.time}`,
    })
  })
  await websync.initialize()

  let shouldInvalidate = true
  if (websync.constitutesPayment()) {
    const stats = websync.getStats()
    const len = stats.invalidations ? stats.invalidations.length : 0
    shouldInvalidate = await prompt(
      `The current transfer has ${len} invalidations, which will incur a charge. ` +
      `Would you like to proceed? (Y/N)`
    )
  }

  const stats = await websync.sync(shouldInvalidate)
  console.log(stats.toString())
}