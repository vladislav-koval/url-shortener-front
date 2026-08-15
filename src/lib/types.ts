export interface CreateLinkResponse {
  short_code: string;
  original_url: string;
  user_id: string | null;
}

export interface ClickItem {
  short_code: string;
  click_count: number;
}

export interface ClicksPage {
  items: ClickItem[];
  total: number;
}

export interface ApiErrorDetail {
  field: string;
  rule: string;
  param?: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}
