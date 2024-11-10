Feature: Create member invalid email

@user1 @web
Scenario: Login and attempt to create a member with an invalid email, see that it fails.
  Given I login
  And I navigate to the "member" functionality

  When I navigate to the "create member" functionality
  And I fill the "member edit" "name" to "|FAKE_NAME|1"
  And I fill the "member edit" "email" to "invalid_email"
  And I fill the "member edit" "notes" to "|FAKE_PARAGRAPH|1"
  And I "save" the "member"
  And I should see member saving failed