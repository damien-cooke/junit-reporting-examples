*** Settings ***
Resource         resources.robot

*** Test Cases ***
Calculator Loads
    Open Browser To App
    Click    text=Calculator
    Get Text    css=[data-testid="calculator-display"]    ==    0

Users Loads
    New Page    ${BASE_URL}/users.html
    Get Text    css=h1    contains    Users

Data Loads
    New Page    ${BASE_URL}/data.html
    Get Text    css=h1    contains    Data
