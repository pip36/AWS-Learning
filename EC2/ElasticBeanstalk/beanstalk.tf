resource "aws_elastic_beanstalk_application" "app" {
  name        = "beanstalk-app"
  description = "test beanstalk app"
}

resource "aws_elastic_beanstalk_environment" "environment" {
  name                = "app-test-environment"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.10 running Docker"
  # https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     =  "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = 1
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = 1
  }
}