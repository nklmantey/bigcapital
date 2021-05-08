import * as R from 'ramda';
import { sumBy } from 'lodash';
import {
  ITransactionsByContactsTransaction,
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsTransaction,
  ITransactionsByVendorsVendor,
  ITransactionsByVendorsData,
  ILedger,
  INumberFormatQuery,
  IVendor,
} from 'interfaces';
import TransactionsByContact from '../TransactionsByContact/TransactionsByContact';

const VENDOR_NORMAL = 'credit';

export default class TransactionsByVendors extends TransactionsByContact {
  readonly contacts: IVendor[];
  readonly transactionsByContact: any;
  readonly filter: ITransactionsByVendorsFilter;
  readonly baseCurrency: string;
  readonly numberFormat: INumberFormatQuery;
  readonly accountsGraph: any;
  readonly ledger: ILedger;

  /**
   * Constructor method.
   * @param {IVendor} vendors
   * @param {Map<number, IAccountTransaction[]>} transactionsByContact
   * @param {string} baseCurrency
   */
  constructor(
    vendors: IVendor[],
    accountsGraph: any,
    ledger: ILedger,
    filter: ITransactionsByVendorsFilter,
    baseCurrency: string
  ) {
    super();

    this.contacts = vendors;
    this.accountsGraph = accountsGraph;
    this.ledger = ledger;
    this.baseCurrency = baseCurrency;
    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
  }

  /**
   * Retrieve the vendor transactions from the given vendor id and opening balance.
   * @param {number} vendorId - Vendor id.
   * @param {number} openingBalance - Opening balance amount.
   * @returns {ITransactionsByVendorsTransaction[]}
   */
  private vendorTransactions(
    vendorId: number,
    openingBalance: number
  ): ITransactionsByVendorsTransaction[] {
    const openingBalanceLedger = this.ledger
      .whereContactId(vendorId)
      .whereFromDate(this.filter.fromDate)
      .whereToDate(this.filter.toDate);

    const openingEntries = openingBalanceLedger.getEntries();

    return R.compose(
      R.curry(this.contactTransactionRunningBalance)(openingBalance, 'credit'),
      R.map(this.contactTransactionMapper.bind(this))
    ).bind(this)(openingEntries);
  }

  /**
   * Vendor section mapper.
   * @param {IVendor} vendor
   * @returns {ITransactionsByVendorsVendor}
   */
  private vendorMapper(vendor: IVendor): ITransactionsByVendorsVendor {
    const openingBalance = this.getContactOpeningBalance(vendor.id);
    const transactions = this.vendorTransactions(vendor.id, openingBalance);
    const closingBalance = this.getVendorClosingBalance(
      transactions,
      openingBalance
    );

    return {
      vendorName: vendor.displayName,
      openingBalance: this.getTotalAmountMeta(
        openingBalance,
        vendor.currencyCode
      ),
      closingBalance: this.getTotalAmountMeta(
        closingBalance,
        vendor.currencyCode
      ),
      transactions,
    };
  }

  /**
   * Retrieve the vendor closing balance from the given customer transactions.
   * @param {ITransactionsByContactsTransaction[]} customerTransactions
   * @param {number} openingBalance
   * @returns
   */
  private getVendorClosingBalance(
    customerTransactions: ITransactionsByContactsTransaction[],
    openingBalance: number
  ) {
    return this.getContactClosingBalance(
      customerTransactions,
      VENDOR_NORMAL,
      openingBalance
    );
  }

  /**
   * Retrieve the vendors sections of the report.
   * @param {IVendor[]} vendors
   * @returns {ITransactionsByVendorsVendor[]}
   */
  private vendorsMapper(vendors: IVendor[]): ITransactionsByVendorsVendor[] {
    return R.compose(R.map(this.vendorMapper.bind(this))).bind(this)(vendors);
  }

  /**
   * Retrieve the report data.
   * @returns {ITransactionsByVendorsData}
   */
  public reportData(): ITransactionsByVendorsData {
    return this.vendorsMapper(this.contacts);
  }

  /**
   * Retrieve the report columns.
   */
  public reportColumns() {
    return [];
  }
}
