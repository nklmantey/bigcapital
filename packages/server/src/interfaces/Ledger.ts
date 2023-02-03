import { Knex } from 'knex';
export interface ILedger {
  entries: ILedgerEntry[];

  getEntries(): ILedgerEntry[];

  whereAccountId(accountId: number): ILedger;
  whereContactId(contactId: number): ILedger;
  whereFromDate(fromDate: Date | string): ILedger;
  whereToDate(toDate: Date | string): ILedger;
  whereCurrencyCode(currencyCode: string): ILedger;
  whereBranch(branchId: number): ILedger;
  whereItem(itemId: number): ILedger;

  getClosingBalance(): number;
  getForeignClosingBalance(): number;

  getContactsIds(): number[];
  getAccountsIds(): number[];
}

export interface ILedgerEntry {
  credit: number;
  debit: number;
  currencyCode: string;
  exchangeRate: number;

  accountId?: number;
  accountNormal: string;
  contactId?: number;
  date: Date | string;

  transactionType: string;
  transactionId: number;

  transactionNumber?: string;

  referenceNumber?: string;
  index: number;
  indexGroup?: number;

  userId?: number;
  itemId?: number;
  branchId?: number;
  projectId?: number;

  entryId?: number;
  createdAt?: Date;

  costable?: boolean;
}

export interface ISaveLedgerEntryQueuePayload {
  tenantId: number;
  entry: ILedgerEntry;
  trx?: Knex.Transaction;
}

export interface ISaveAccountsBalanceQueuePayload {
  ledger: ILedger;
  tenantId: number;
  accountId: number;
  trx?: Knex.Transaction;
}

export interface ISaleContactsBalanceQueuePayload {
  ledger: ILedger;
  tenantId: number;
  contactId: number;
  trx?: Knex.Transaction;
}
