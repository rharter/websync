export const ErrorCodes = {
  TransferFailed: 1,
  TooManyInvalidations: 2,
  InvalidationsFailed: 3,
  AlreadyInitialized: 4,
  AlreadyCompleted: 5,
}

export class Base extends Error {
  public code: number

  constructor(msg: string, code: number) {
    super(msg)

    this.code = code
  }
}

export class TransferFailed extends Base {
  public transferError: Error

  constructor(transferError: Error) {
    super(`Websync: Transfer Failed.`, ErrorCodes.TransferFailed)

    this.transferError = transferError
  }
}

export class TooManyInvalidations extends Base {
  constructor() {
    super(`Websync: Too many invalidations.`, ErrorCodes.TooManyInvalidations)
  }
}

export class InvalidationsFailed extends Base {
  public invalidationsError: Error

  constructor(invalidationsError: Error) {
    super(`Websync: Invalidations Failed.`, ErrorCodes.InvalidationsFailed)

    this.invalidationsError = invalidationsError
  }
}

export class AlreadyInitialized extends Base {
  constructor() {
    super(`Websync: Already initialized.`, ErrorCodes.AlreadyInitialized)
  }
}

export class AlreadyCompleted extends Base {
  constructor() {
    super(`Websync: Already completed.`, ErrorCodes.AlreadyCompleted)
  }
}