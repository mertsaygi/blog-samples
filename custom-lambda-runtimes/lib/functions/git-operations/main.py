from git import Repo
import os

def lambda_handler(event, context): 
    #os.system("git")
    repo = Repo.clone_from('https://github.com/mertsaygi/blog-samples.git','/tmp/blog-samples/')
    print(repo.git.status())
    return None


