resource "aws_security_group" "app_security_group" {
  name        = "app-security-group"
  description = "Security Group for application"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# Create target group for load balancer
resource "aws_lb_target_group" "load_balancer_target_group" {
  name     = "app-load-balancer-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.my_vpc.id

  health_check {
    interval            = 10
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Create load balancer
resource "aws_lb" "load_balancer" {
  name               = "app-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app_security_group.id]
  subnets            = [for subnet in aws_subnet.my_public_subnets : subnet.id]
}

resource "aws_lb_listener" "app-listener" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.load_balancer_target_group.arn
  }
}

# Create AutoScalingGroup
resource "aws_launch_template" "app_launch_template" {
  name          = "app_launch_template"
  description   = "Sample launch template for application"
  image_id      = "ami-04dd4500af104442f" // Amazon Linux 2 AMI
  instance_type = "t2.micro"
  user_data     = filebase64("${path.module}/user_data.sh")

  network_interfaces {
    associate_public_ip_address = true
    delete_on_termination       = true
    security_groups             = [aws_security_group.app_security_group.id]
  }
}

resource "aws_autoscaling_group" "asg" {
  vpc_zone_identifier = [for subnet in aws_subnet.my_public_subnets : subnet.id]
  desired_capacity    = 1
  max_size            = 1
  min_size            = 1

  launch_template {
    id      = aws_launch_template.app_launch_template.id
    version = "$Latest"
  }
}

# Attach the load balancer target group to the auto scaling group
resource "aws_autoscaling_attachment" "asg_load_balancer_attachment" {
  autoscaling_group_name = aws_autoscaling_group.asg.id
  alb_target_group_arn   = aws_lb_target_group.load_balancer_target_group.id
}


