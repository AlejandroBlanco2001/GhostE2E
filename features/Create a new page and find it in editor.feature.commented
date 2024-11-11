Feature: See a new page in editor

@user1 @web
Scenario: Como administrador inicio sesion, creo una página nueva y la busco en el editor
  Given I login
    And I navigate to the "pages" functionality
    And I create a new page called "Prueba vista editor"
    And I navigate to the "pages" functionality
    
  Then I should find a "title" element with "Prueba vista editor" text