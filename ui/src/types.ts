export interface User {
  id: number;
  created_at: string;
  name: string;
  email: string;
  activated: boolean;
}

export interface AuthToken {
  token: string;
  expiry: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  version: number;
}

export interface Metadata {
  current_page: number;
  page_size: number;
  first_page: number;
  last_page: number;
  total_records: number;
}
