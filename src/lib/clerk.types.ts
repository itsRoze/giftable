/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  object: string;
  external_id: string;
  username: null;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  primary_email_address_id: string;
  primary_phone_number_id: null;
  primary_web3_wallet_id: null;
  password_enabled: boolean;
  two_factor_enabled: boolean;
  email_addresses: EmailAddress[];
  phone_numbers: PhoneNumber[];
  web3_wallets: Web3Wallet[];
  external_accounts: any[];
  public_metadata: Metadata;
  private_metadata: Metadata;
  created_at: number;
  updated_at: number;
}

export interface EmailAddress {
  id: string;
  object: string;
  email_address: string;
  verification: Verification;
  linked_to: any[];
}

export interface Verification {
  status: string;
  strategy: string;
  attempts: number;
  expire_at: number;
  nonce?: string;
}

export interface PhoneNumber {
  id: string;
  object: string;
  phone_number: string;
  reserved_for_second_factor: boolean;
  verification: Verification;
  linked_to: any[];
}

export interface Metadata {
  role?: string;
}

export interface Web3Wallet {
  id: string;
  object: string;
  web3_wallet: string;
  verification: Verification;
}
