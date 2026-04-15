# setup_windows_tasks.ps1
# Configure Windows Task Scheduler for Gold Tier scheduled tasks

# Set the project path
$ProjectPath = "C:\Users\HP\AI_Employee_Project"
$PythonPath = "python"

Write-Host "Setting up Windows Task Scheduler for Gold Tier AI Employee..." -ForegroundColor Green

# Task 1: Social Broadcast Daily at 9:05 AM
$TaskName1 = "AIEmployee_SocialBroadcast"
$Action1 = New-ScheduledTaskAction -Execute $PythonPath -Argument "$ProjectPath\social-broadcaster.py" -WorkingDirectory $ProjectPath
$Trigger1 = New-ScheduledTaskTrigger -Daily -At "09:05AM"
$Settings1 = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$Principal1 = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -RunLevel Highest

# Check if task already exists, if so delete it
$ExistingTask1 = Get-ScheduledTask | Where-Object {$_.TaskName -eq $TaskName1}
if ($ExistingTask1) {
    Unregister-ScheduledTask -TaskName $TaskName1 -Confirm:$false
    Write-Host "Removed existing task: $TaskName1" -ForegroundColor Yellow
}

Register-ScheduledTask -TaskName $TaskName1 -Action $Action1 -Trigger $Trigger1 -Settings $Settings1 -Principal $Principal1
Write-Host "Created task: $TaskName1 - Daily at 9:05 AM" -ForegroundColor Cyan

# Task 2: Subscription Audit Weekly on Monday at 9:00 AM
$TaskName2 = "AIEmployee_SubAudit"
$Action2 = New-ScheduledTaskAction -Execute $PythonPath -Argument "$ProjectPath\watchers\subscription_auditor.py" -WorkingDirectory $ProjectPath
$Trigger2 = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At "09:00AM"
$Settings2 = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$Principal2 = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -RunLevel Highest

# Check if task already exists, if so delete it
$ExistingTask2 = Get-ScheduledTask | Where-Object {$_.TaskName -eq $TaskName2}
if ($ExistingTask2) {
    Unregister-ScheduledTask -TaskName $TaskName2 -Confirm:$false
    Write-Host "Removed existing task: $TaskName2" -ForegroundColor Yellow
}

Register-ScheduledTask -TaskName $TaskName2 -Action $Action2 -Trigger $Trigger2 -Settings $Settings2 -Principal $Principal2
Write-Host "Created task: $TaskName2 - Weekly on Monday at 9:00 AM" -ForegroundColor Cyan

# Task 3: CEO Briefing Weekly on Sunday at 11:00 PM
$TaskName3 = "AIEmployee_CEOBriefing"
$Action3 = New-ScheduledTaskAction -Execute $PythonPath -Argument "$ProjectPath\watchers\ceo_briefing_generator.py" -WorkingDirectory $ProjectPath
$Trigger3 = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At "11:00PM"
$Settings3 = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$Principal3 = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -RunLevel Highest

# Check if task already exists, if so delete it
$ExistingTask3 = Get-ScheduledTask | Where-Object {$_.TaskName -eq $TaskName3}
if ($ExistingTask3) {
    Unregister-ScheduledTask -TaskName $TaskName3 -Confirm:$false
    Write-Host "Removed existing task: $TaskName3" -ForegroundColor Yellow
}

Register-ScheduledTask -TaskName $TaskName3 -Action $Action3 -Trigger $Trigger3 -Settings $Settings3 -Principal $Principal3
Write-Host "Created task: $TaskName3 - Weekly on Sunday at 11:00 PM" -ForegroundColor Cyan

Write-Host ""
Write-Host "All Gold Tier scheduled tasks configured:" -ForegroundColor Green
Write-Host "1. $TaskName1 - Daily social broadcasting (09:05 AM)" -ForegroundColor White
Write-Host "2. $TaskName2 - Weekly subscription audit (Monday 09:00 AM)" -ForegroundColor White
Write-Host "3. $TaskName3 - Weekly CEO briefing (Sunday 11:00 PM)" -ForegroundColor White

Write-Host ""
Write-Host "To verify tasks:" -ForegroundColor Green
Write-Host "  Get-ScheduledTask -TaskName AIEmployee_*" -ForegroundColor Yellow

Write-Host ""
Write-Host "Setup Complete!" -ForegroundColor Green