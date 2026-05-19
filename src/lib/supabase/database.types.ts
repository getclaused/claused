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
    };
  };
}
