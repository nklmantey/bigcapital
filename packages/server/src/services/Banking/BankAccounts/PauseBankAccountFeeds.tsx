import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './types';

@Service()
export class PauseBankAccountFeeds {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Pauses the bankfeed syncing of the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async pauseBankAccountFeeds(tenantId: number, bankAccountId: number) {
    const { Account, PlaidItem } = this.tenancy.models(tenantId);

    const oldAccount = await Account.query()
      .findById(bankAccountId)
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    // Can't continue if the bank account is not connected.
    if (!oldAccount.plaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    // Cannot continue if the bank account feeds is already paused.
    if (oldAccount.plaidItem.isPaused) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_FEEDS_ALREADY_PAUSED);
    }
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await PlaidItem.query(trx).findById(oldAccount.plaidItem.id).patch({
        pausedAt: null,
      });
    });
  }
}
