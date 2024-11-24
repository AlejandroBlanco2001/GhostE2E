Feature: Crear tag válido EP016

@user1 @web
Scenario: As user I login and create a tag with valid name.
    Given I login
    And I navigate to the "create tag" functionality
    And I wait for 2 seconds
    When I enter tag name "|FAKE_TAG_NAME|1"
    When I save the tag
    Then I should see tag saving "success"