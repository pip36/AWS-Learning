variable "api_gateway_id" {
  type        = string
  description = "The id of the api gateway."
}

variable "api_gateway_execution_arn" {
  type        = string
  description = "The execution arn of the api gateway."
}

variable "api_gateway_authorizer_id" {
  type        = string
  description = "The id of the authorizer to use."
}

variable "function_name" {
  type        = string
  description = "The name of the function. Expects a file `api/{function_name.py}` to exist, with a `handle` function"
}

variable "policy_arns" {
  type        = list(string)
  description = "A list of IAM policies to attach to the lambda"
}
