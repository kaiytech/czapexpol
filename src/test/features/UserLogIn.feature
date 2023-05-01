Feature: User Log In
  As a User
  I want to be able to access my account
  To fulfill my experience at the store


Scenario: Successful log in
  Given I am a registered user
  When I try to log in using my credentials
  Then My login attempt is successful
  And I'm given a login token to use later


Scenario: Unsuccessful log in
  Given I am a registered user
  When I try to log in using wrong credentials
  Then my login attempt is unsuccessful
