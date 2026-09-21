export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'ESEWA' | 'KHALTI';

export interface ConsultationPackage {
  id: number;
  expertId: number;
  expertName: string;
  cropId: number | null;
  cropName: string | null;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationHours: number;
  active: boolean;
  createdAt: string;
}

export interface CreateConsultationPackageRequest {
  cropId?: number | null;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  durationHours: number;
}

export interface UpdateConsultationPackageRequest {
  name?: string;
  description?: string;
  price?: number;
  durationHours?: number;
  active?: boolean;
}

export interface PaymentInitiationResponse {
  paymentId: number;
  consultationId: number;
  transactionUuid: string;
  amount: number;
  currency: string;
  paymentUrl: string;
  method: string;
  formFields: Record<string, string>;
}

export interface PaymentResponseDto {
  id: number;
  consultationId: number;
  payerId: number;
  provider: PaymentProvider;
  transactionUuid: string;
  providerTransactionId: string | null;
  providerReferenceId: string | null;
  amount: number;
  currency: string;
  platformCommission: number;
  expertAmount: number;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface VerifyPaymentRequest {
  data: string;
}

export type LedgerEntryType = 'EXPERT_EARNING' | 'PLATFORM_COMMISSION' | 'WITHDRAWAL' | 'REFUND';

export interface WalletLedgerEntry {
  id: number;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  referenceType: string | null;
  referenceId: number | null;
  description: string | null;
  createdAt: string;
}

export interface ExpertEarningsSummary {
  totalEarnings: number;
  availableEarnings: number;
  pendingWithdrawal: number;
  totalWithdrawn: number;
  transactions: WalletLedgerEntry[];
}

export type WithdrawalStatus = 'PENDING' | 'PROCESSED' | 'REJECTED';

export interface WithdrawalRequest {
  id: number;
  expertId: number;
  expertName: string;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  accountDetails: string;
  requestedAt: string;
  processedAt: string | null;
  adminNotes: string | null;
}

export interface CreateWithdrawalRequest {
  amount: number;
  accountDetails: string;
}

export interface AdminFinancialSummary {
  totalGrossRevenue: number;
  totalPlatformCommission: number;
  totalExpertEarnings: number;
  successfulPaymentsCount: number;
  pendingPaymentsCount: number;
  failedPaymentsCount: number;
}
