// Existing Types
export interface AutoTextoTrigger {
  id: string
  trigger: string
  content: string
  category: string
  tags: string[]
  conditions: string[]
}

// Enums
export enum Modality {
  CT = 'CT',
  MRI = 'MRI',
  XR = 'XR',
  US = 'US',
  NM = 'NM'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ExamType {
  MRI = 'MRI',
  CT = 'CT',
  XRAY = 'XR'
}

export enum AIAction {
  GENERATE_REPORT = 'GENERATE_REPORT',
  FOLLOW_UP = 'FOLLOW_UP',
  GENERATE_IMPRESSIONS = 'GENERATE_IMPRESSIONS',
  ENHANCE_REPORT = 'ENHANCE_REPORT'
}

// Dynamic Fields
export interface DynamicField {
  id: string
  name: string
  type: 'measurement' | 'select' | 'text' | 'boolean'
  options?: string[] // For select type
  defaultValue?: string | number | boolean
  unit?: string // For measurements
}

export interface TemplateSection {
  id: string
  title: string
  content: string
  isOptional?: boolean
  dynamicFields?: DynamicField[]
}

// Core Types
export interface Template {
  id: string
  name: string
  description: string
  modality: Modality
  bodyPart: string
  type: 'normal' | 'findings' | 'emergency'
  sections: TemplateSection[]
  tags: string[]
  shortcut?: string // Added shortcut property
  isCustom?: boolean
  userId?: string
  user?: User
  isFavorite?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  id: string
  name: string
  email: string
  password?: string
  role?: UserRole
  preferences: {
    theme: 'light' | 'dark'
    autoSave: boolean
    defaultModality: Modality
    favoriteTemplates: string[] // Template IDs
    recentTemplates: string[] // Template IDs
  }
  apiKeys?: ApiKey[]
  reports?: Report[]
  templates?: Template[]
  sessions?: Session[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Session {
  id: string
  userId: string
  user?: User
  token: string
  expires: Date
  createdAt: Date
  updatedAt: Date
}

export interface ApiKey {
  id: string
  userId: string
  user?: User
  name: string
  key: string
  lastUsed?: Date | null
  expiresAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Report {
  id: string
  title: string
  content: string
  examType: ExamType
  findings: string
  impression?: string | null
  userId: string
  user?: User
  aiResponses?: AIResponse[]
  createdAt: Date
  updatedAt: Date
}

export interface AIResponse {
  id: string
  reportId: string
  report?: Report
  action: AIAction
  prompt: string
  response: string
  model: string
  tokens: number
  createdAt: Date
}

export interface RateLimit {
  id: string
  userId: string
  requestType: string
  count: number
  window: Date
  createdAt: Date
}

export interface ClaudeCache {
  id: string
  hash: string
  prompt: string
  response: string
  action: AIAction
  model: string
  createdAt: Date
  expiresAt: Date
}

// API Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Create/Update Types
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateReportInput = Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'aiResponses'>;
export type UpdateReportInput = Partial<Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'aiResponses'>>;

export type CreateTemplateInput = Omit<Template, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTemplateInput = Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateAIResponseInput = Omit<AIResponse, 'id' | 'createdAt'>;

// Utility Types
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
