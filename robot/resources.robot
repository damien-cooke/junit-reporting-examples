*** Settings ***
Library           Browser
Suite Setup       Open Browser To App
Suite Teardown    Close Browser

*** Variables ***
${BASE_URL}       http://localhost:3000

*** Keywords ***
Open Browser To App
    New Browser    chromium    headless=true
    New Context
    New Page       ${BASE_URL}

*** Test Cases ***
App Healthcheck
    Get Title    contains    JUnit Reporting Examples

Open Calculator
    Click    text=Calculator
    Get Text    css=[data-testid="calculator-display"]    ==    0
