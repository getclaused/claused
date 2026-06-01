export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AnalysisStatus = "processing" | "completed" | "failed";
export type RiskLevel = "high" | "medium" | "low";

export interface AnalysisIssue {
  category: string;
  severity: RiskLevel;
  clause_excerpt: string;
  description: string;
  suggestion: string;
}

export interface AnalysisResult {
  summary: string;
  risk_level: RiskLevel;
  issues: AnalysisIssue[];
  missing_clauses: string[];
  positive_points: string[];
}

export type ComparisonStatus = "processing" | "completed" | "failed";
export type NegotiationOutcome = "favorable" | "neutral" | "unfavorable";
export type ChangeType = "modified" | "added" | "removed";
export type RiskChange = "increased" | "decreased" | "unchanged";

export interface ComparisonChange {
  category: string;
  change_type: ChangeType;
  risk_change: RiskChange;
  before?: string;
  after?: string;
  impact: string;
  recommendation: string;
}

export interface ComparisonResult {
  summary: string;
  negotiation_outcome: NegotiationOutcome;
  outcome_reason: string;
  changes: ComparisonChange[];
  remaining_concerns: string[];
  successful_negotiations: string[];
}

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string;
          created_at: string;
          session_id: string;
          file_name: string;
          file_path: string;
          risk_level: RiskLevel | null;
          result: AnalysisResult;
          status: AnalysisStatus;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          session_id: string;
          file_name: string;
          file_path: string;
          risk_level?: RiskLevel | null;
          result: AnalysisResult;
          status?: AnalysisStatus;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          session_id?: string;
          file_name?: string;
          file_path?: string;
          risk_level?: RiskLevel | null;
          result?: AnalysisResult;
          status?: AnalysisStatus;
          error_message?: string | null;
        };
      };
      comparisons: {
        Row: {
          id: string;
          created_at: string;
          session_id: string;
          file_name_a: string;
          file_name_b: string;
          file_path_a: string;
          file_path_b: string;
          result: ComparisonResult;
          status: ComparisonStatus;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          session_id: string;
          file_name_a: string;
          file_name_b: string;
          file_path_a: string;
          file_path_b: string;
          result: ComparisonResult;
          status?: ComparisonStatus;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          session_id?: string;
          file_name_a?: string;
          file_name_b?: string;
          file_path_a?: string;
          file_path_b?: string;
          result?: ComparisonResult;
          status?: ComparisonStatus;
          error_message?: string | null;
        };
      };
    };
  };
}
