Feature: User account self-management
  As a User,
  I want to be able to edit my account details myself,
  So whenever these change, I don't have to contact an administrator


  Scenario Outline: Successfully updating account details
  Given I am a logged in user
  When I attempt to set my "<detail>" to "<value>"
  Then the operation is successful
  And the "<detail>" is indeed "<value>"

Examples:
    | detail        | value                           |
    | imienazwisko  | Karol Wojtyla                   |
    | adres         | Wadowice 34-100 ul. Koscielna 7 |


  Scenario: Changing password
    Given I am a logged in user
    When I attempt to change my password to "WojowniczeZlowie13"
    Then the operation is successful
    And I am able to log back in with password "WojowniczeZlowie13" after logging out


  Scenario: Deleting account
    Given I am a logged in user
    When I attempt to delete my account
    Then the operation is successful
    And my account is indeed deleted