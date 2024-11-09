Feature: Edit member

@user1 @web
Scenario: Login and create a member, then edit the member and see it succeeds
  Given I login
  And I navigate to the "member" functionality

  # First member
  When I navigate to the "create member" functionality
  And I fill the "member edit" "name" to "|FAKE_NAME|1"
  And I fill the "member edit" "email" to "|FAKE_EMAIL|1"
  And I fill the "member edit" "notes" to "|FAKE_PARAGRAPH|1"
  And I "save" the "member"
  And I go back
  # Edit the member
  And I navigate to the "edit member" functionality with email "|FAKE_EMAIL|1"
  And I set the "member edit" "name" to "|FAKE_NAME|2"
  And I set the "member edit" "email" to "|FAKE_EMAIL|2"
  And I set the "member edit" "notes" to "|FAKE_PARAGRAPH|2"
  And I "save" the "member"
  And I go back

  Then I should "see" the "member" "email" "|FAKE_EMAIL|2" in the "list"
  And I should "see" the "member" "name" "|FAKE_NAME|2" in the "list"
  And I should "not see" the "member" "email" "|FAKE_EMAIL|1" in the "list"
  And I should "not see" the "member" "name" "|FAKE_NAME|1" in the "list"
  
