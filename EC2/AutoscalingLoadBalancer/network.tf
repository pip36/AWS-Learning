## Network ##

# Create a VPC
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "my-vpc"
  }
}

# variables for 2 public subnets
variable "public_subnets" {
  type = map(object({
    cidr_block = string
    az         = string
  }))

  default = {
    "public-1a" = {
      az         = "eu-west-1a"
      cidr_block = "10.0.0.0/25"
    }
    "public-1b" = {
      az         = "eu-west-1b"
      cidr_block = "10.0.0.128/25"
    }
  }
}

# Create the subnets
resource "aws_subnet" "my_public_subnets" {
  for_each          = var.public_subnets
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.az
  tags = {
    Name = each.key
  }
}

# Create an internet gateway to allow public access
resource "aws_internet_gateway" "my_internet_gateway" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "my-internet-gateway"
  }
}

# Create a route table with a route for each subnet to the internet gateway
resource "aws_route_table" "my_public_route_table" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "my_public_route_table"
  }
}

resource "aws_route" "my_public_routes" {
  route_table_id         = aws_route_table.my_public_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.my_internet_gateway.id
}

# Add the public route table to each subnet
resource "aws_route_table_association" "my_subnet_route_table_association" {
  for_each = tomap({
    for k, subnet in aws_subnet.my_public_subnets : k => subnet.id
  })
  subnet_id      = each.value
  route_table_id = aws_route_table.my_public_route_table.id
}