Feature: Navigate to new page

@user1 @web
Scenario: Como administrador inicio sesion, creo una página nueva y navego hacia ella
  Given I login
    And I navigate to the "pages" functionality
    And I create a new page called "Prueba de Navegacion"
  Then page "prueba-de-navegacion" should exists