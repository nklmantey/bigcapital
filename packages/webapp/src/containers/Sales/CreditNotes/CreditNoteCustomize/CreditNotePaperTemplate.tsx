import { Group, Stack } from '@/components';
import { PaperTemplate, PaperTemplateProps } from '../../Invoices/InvoiceCustomize/PaperTemplate';

export interface CreditNotePaperTemplateProps extends PaperTemplateProps {
  billedToAddress?: Array<string>;
  billedFromAddress?: Array<string>;

  // Total
  total?: string;
  showTotal?: boolean;
  totalLabel?: string;

  // Subtotal;
  subtotal?: string;
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Customer Note.
  showCustomerNote?: boolean;
  customerNote?: string;
  customerNoteLabel?: string;

  // Terms & Conditions
  showTermsConditions?: boolean;
  termsConditions?: string;
  termsConditionsLabel?: string;

  lines?: Array<{
    item: string;
    description: string;
    rate: string;
    quantity: string;
    total: string;
  }>;

  // Date issue.
  creditNoteDateLabel?: string;
  showCreditNoteDate?: boolean;
  creditNoteDate?: string;

  // Credit Number.
  creditNoteNumebr?: string;
  creditNoteNumberLabel?: string;
  showCreditNoteNumber?: boolean;
}

export function CreditNotePaperTemplate({
  primaryColor,
  secondaryColor,
  showCompanyLogo = true,
  companyLogo,

  billedToAddress = [
    'Bigcapital Technology, Inc.',
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  billedFromAddress = [
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  total = '$1000.00',
  totalLabel = 'Total',
  showTotal = true,

  subtotal = '1000/00',
  subtotalLabel = 'Subtotal',
  showSubtotal = true,

  showCustomerNote = true,
  customerNote = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  customerNoteLabel = 'Customer Note',

  showTermsConditions = true,
  termsConditions = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  termsConditionsLabel = 'Terms & Conditions',

  lines = [
    {
      item: 'Simply dummy text',
      description: 'Simply dummy text of the printing and typesetting',
      rate: '1',
      quantity: '1000',
      total: '$1000.00',
    },
  ],
  showCreditNoteNumber = true,
  creditNoteNumberLabel = 'Credit Note Number',
  creditNoteNumebr = '346D3D40-0001',

  creditNoteDate = 'September 3, 2024',
  showCreditNoteDate = true,
  creditNoteDateLabel = 'Credit Note Date',
}: CreditNotePaperTemplateProps) {
  return (
    <PaperTemplate
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      showCompanyLogo={showCompanyLogo}
      companyLogo={companyLogo}
      bigtitle={'Credit Note'}
    >
      <Stack spacing={24}>
        <PaperTemplate.TermsList>
          {showCreditNoteNumber && (
            <PaperTemplate.TermsItem label={creditNoteNumberLabel}>
              {creditNoteNumebr}
            </PaperTemplate.TermsItem>
          )}

          {showCreditNoteDate && (
            <PaperTemplate.TermsItem label={creditNoteDateLabel}>
              {creditNoteDate}
            </PaperTemplate.TermsItem>
          )}
        </PaperTemplate.TermsList>

        <Group spacing={10}>
          <PaperTemplate.Address items={billedToAddress} />
          <PaperTemplate.Address items={billedFromAddress} />
        </Group>

        <Stack spacing={0}>
          <PaperTemplate.Table
            columns={[
              { label: 'Item', accessor: 'item' },
              { label: 'Description', accessor: 'item' },
              { label: 'Rate', accessor: 'rate' },
              { label: 'Total', accessor: 'total' },
            ]}
            data={lines}
          />
          <PaperTemplate.Totals>
            {showSubtotal && (
              <PaperTemplate.TotalLine
                label={subtotalLabel}
                amount={subtotal}
              />
            )}
            {showTotal && (
              <PaperTemplate.TotalLine label={totalLabel} amount={total} />
            )}
          </PaperTemplate.Totals>
        </Stack>

        <Stack spacing={0}>
          {showCustomerNote && (
            <PaperTemplate.Statement label={customerNoteLabel}>
              {customerNote}
            </PaperTemplate.Statement>
          )}
          {showTermsConditions && (
            <PaperTemplate.Statement label={termsConditionsLabel}>
              {termsConditions}
            </PaperTemplate.Statement>
          )}
        </Stack>
      </Stack>
    </PaperTemplate>
  );
}
