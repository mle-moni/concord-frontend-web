export interface ValidationError {
	field: string
	message: string
	rule: 'required' | 'email' | 'unique' | 'confirmed' | 'maxLength'
}

export interface Token {
	expires_at: string
	token: string
	type: string
}

export interface LoginSuccessResponse {
	user: UserPrivateData
	token: Token
}

export interface UserPublicData {
	id: number
	username: string
}

export interface UserPrivateData {
	id: number
	email: string
	username: string
}
