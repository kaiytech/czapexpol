Feature: Products
  As a User
  I want to be able to interact with the products
  So that I can feel like I'm physically at the store

Scenario Outline: Creating a new product
  Given I am a logged in user
  And I am a seller
  When I create a new product with name "<name>", category "<category>", quantity "<quantity>" and price "<price>"
  Then the request is "<result>"

  Examples:
  | name                  | category  | quantity | price           | result |
  | Jakas Czapka          | Malarskie | 1        | 19.99           | OK     |
  | Inna Czapka           | Specjalne | 1        | 29.99           | ERROR  |
  | Kolejna Czapka        | Malarskie | a        | 9.99            | ERROR  |
  | Jeszcze Jedna Czapka  | Malarskie | 2        | Duzo pieniazkow | ERROR  |


Scenario: Attempting to create a new product when not a seller
  Given I am a logged in user
  And I am not a seller
  When I create a new product with name "Czapka mikolaja", category "Swiateczne", quantity "1" and price "0.99"
  Then the request is "ERROR"


Scenario: Listing all products
  Given I am a logged in user
  When I request a list of all products
  Then I am given a list of all products