import { ValidationError } from '~/helpers/types/ApiTypes'

function displayValidationError(err: ValidationError): string {
	switch (err.rule) {
		case 'required':
			return `the field ${err.field} is required`
		case 'email':
			return `the field ${err.field} must be a valid email address`
		case 'unique':
			return `this ${err.field} is already used`
		case 'confirmed':
			return `passwords do not match`
		case 'maxLength':
			return `the field ${err.field} must be less than 30 characters`
		case 'minLength':
			return `the field ${err.field} must be more than 3 characters`
		default:
			return `the field ${err.field} has an error ${err.rule}`
	}
}

export { displayValidationError }
