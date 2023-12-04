# US910 - Como administrador de sistemas quero que o administrador tenha um acesso SSH à maquina virtual, apenas por certificado, sem recurso a password

## 1. Context

* First time that this task is developed.

## 2. Requirements

**Dependencies:**
- **No dependencies**

## 3. Analysis

The task aims to establish the necessary configuration to allow the administrator to access the virtual machine via SSH exclusively through a certificate, eliminating password authentication.

1. SSH Key Generation:

* The administrator must generate an SSH key pair (public and private).
* The public key must be copied to the virtual machine.

2. SSHd Configuration:

* The SSH service (sshd) on the virtual machine must be configured to allow public key authentication only.
* Password authentication must be disabled.

3. File Permissions:
* The permissions of files related to SSH keys must be strictly configured to ensure security.

4. Connection Tests:

* The administrator must perform connection tests to ensure that certificate access is configured correctly.

## 4. Implementation


## 5. Observations

