Feature: Create valid internal tag EP022

@user1 @web
Scenario: As user I login and create a valid internal tag.
    Given I login
    And I navigate to the "create tag" functionality
    And I wait for 2 seconds
    When I enter tag name "#internal tag"
    And I save the tag
    And I navigate to the "internal tags" functionality
    Then I should see the tag "internal-tag" saved