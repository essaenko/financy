import { UserState } from './UserModel'
import { AccountState } from './AccountModel'

export const state = {
  user: new UserState(),
  account: new AccountState(),
}
