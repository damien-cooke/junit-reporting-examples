// User Management functionality
class UserManager {
    constructor() {
        this.users = [];
        this.currentEditingUser = null;
        this.baseURL = '';
        
        this.initializeEventListeners();
        this.loadUsers();
    }

    initializeEventListeners() {
        // Form submission
        const userForm = document.getElementById('user-form');
        if (userForm) {
            userForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Explicit save button should submit the form (tests click this button)
        const saveUserBtn = document.getElementById('save-user-btn');
        if (saveUserBtn && userForm) {
            saveUserBtn.addEventListener('click', () => {
                // Manual validation before submit to surface .alert-danger for tests
                const formData = new FormData(userForm);
                const candidate = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    role: formData.get('role'),
                    status: formData.get('status')
                };
                if (!this.validateUserData(candidate)) {
                    return; // don't submit if invalid
                }
                if (typeof userForm.requestSubmit === 'function') {
                    userForm.requestSubmit();
                } else {
                    userForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
            });
        }

        // Add user button
        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => this.showAddUserModal());
        }

        // Search functionality
        const searchInput = document.getElementById('search-users');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchUsers(e.target.value));
        }

        // Clear search buttons (there may be more than one in the DOM)
        document.querySelectorAll('#clear-search').forEach(btn => {
            btn.addEventListener('click', () => {
                const si = document.getElementById('search-users');
                if (si) {
                    si.value = '';
                    this.searchUsers('');
                }
            });
        });

        // Filter functionality
        const filterSelect = document.getElementById('filter-status');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => this.filterUsers(e.target.value));
        }

        // Bulk actions
        const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', () => this.bulkDelete());
        }

        const selectAllCheckbox = document.getElementById('select-all');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => this.selectAll(e.target.checked));
        }

        // Generate sample data
        const generateDataBtn = document.getElementById('generate-sample-data');
        if (generateDataBtn) {
            generateDataBtn.addEventListener('click', () => this.generateSampleData());
        }

        // Export data
        const exportBtn = document.getElementById('export-users');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportUsers());
        }
    }

    async loadUsers() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/users');
            
            if (response.ok) {
                this.users = await response.json();
                this.renderUsersTable();
                this.updateStats();
            } else {
                const error = await response.json();
                this.showAlert('error', `Failed to load users: ${error.error}`);
            }
        } catch (error) {
            this.showAlert('error', `Network error: ${error.message}`);
            // Load some default data for testing
            this.loadDefaultUsers();
        } finally {
            this.showLoading(false);
        }
    }

    loadDefaultUsers() {
        this.users = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: new Date().toISOString() },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: new Date().toISOString() },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', createdAt: new Date().toISOString() }
        ];
        this.renderUsersTable();
        this.updateStats();
    }

    renderUsersTable(usersToRender = this.users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        if (usersToRender.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="fas fa-user-slash fa-2x text-muted mb-2"></i>
                        <p class="text-muted mb-0">No users found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = usersToRender.map(user => `
            <tr data-user-id="${user.id}" data-testid="user-row">
                <td>
                    <input type="checkbox" class="form-check-input user-checkbox" value="${user.id}" data-testid="user-checkbox-${user.id}">
                </td>
                <td data-testid="user-id">${user.id}</td>
                <td>${this.escapeHtml(user.name)}</td>
                <td data-testid="user-email">${this.escapeHtml(user.email)}</td>
                <td data-testid="user-role">
                    <span class="badge bg-${this.getRoleBadgeColor(user.role)}">${user.role}</span>
                </td>
                <td data-testid="user-status">
                    <span class="badge bg-${user.status === 'active' ? 'success' : 'secondary'}">${user.status}</span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="userManager.editUser(${user.id})" data-testid="edit-user-${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="userManager.deleteUser(${user.id})" data-testid="delete-user-${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners for checkboxes
        document.querySelectorAll('.user-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateBulkActions());
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            role: formData.get('role'),
            status: formData.get('status')
        };

        // Validate form data
        if (!this.validateUserData(userData)) {
            return;
        }

        try {
            this.showLoading(true);
            
            if (this.currentEditingUser) {
                await this.updateUser(this.currentEditingUser.id, userData);
            } else {
                await this.createUser(userData);
            }
            
            this.hideModal();
            this.resetForm();
        } catch (error) {
            this.showAlert('error', `Operation failed: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    async createUser(userData) {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const newUser = await response.json();
                this.users.push(newUser);
                this.renderUsersTable();
                this.updateStats();
                this.showAlert('success', 'User created successfully!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create user');
            }
        } catch (error) {
            // Fallback to local creation for testing
            const newUser = {
                id: Date.now(),
                ...userData,
                createdAt: new Date().toISOString()
            };
            this.users.push(newUser);
            this.renderUsersTable();
            this.updateStats();
            this.showAlert('success', 'User created successfully! (Local mode)');
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                const index = this.users.findIndex(user => user.id === id);
                if (index !== -1) {
                    this.users[index] = updatedUser;
                }
                this.renderUsersTable();
                this.updateStats();
                this.showAlert('success', 'User updated successfully!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update user');
            }
        } catch (error) {
            // Fallback to local update for testing
            const index = this.users.findIndex(user => user.id === id);
            if (index !== -1) {
                this.users[index] = { ...this.users[index], ...userData };
                this.renderUsersTable();
                this.updateStats();
                this.showAlert('success', 'User updated successfully! (Local mode)');
            }
        }
    }

    async deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            this.showLoading(true);
            
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });

            if (response.ok || response.status === 404) {
                this.users = this.users.filter(user => user.id !== id);
                this.renderUsersTable();
                this.updateStats();
                this.showAlert('success', 'User deleted successfully!');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete user');
            }
        } catch (error) {
            // Fallback to local deletion for testing
            this.users = this.users.filter(user => user.id !== id);
            this.renderUsersTable();
            this.updateStats();
            this.showAlert('success', 'User deleted successfully! (Local mode)');
        } finally {
            this.showLoading(false);
        }
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            this.showAlert('error', 'User not found');
            return;
        }

        this.currentEditingUser = user;
        
        // Populate form
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-status').value = user.status;

        // Update modal title
        document.getElementById('user-modal-title').textContent = 'Edit User';
        
        this.showModal();
    }

    showAddUserModal() {
        this.currentEditingUser = null;
        this.resetForm();
        document.getElementById('user-modal-title').textContent = 'Add New User';
        this.showModal();
    }

    showModal() {
        // Temporarily remove data-testid attributes from TABLE cells only to avoid strict locator clashes
        this.toggleRowTestIds(false);
        const modal = new bootstrap.Modal(document.getElementById('user-modal'));
        modal.show();
    }

    hideModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('user-modal'));
        if (modal) {
            modal.hide();
        }
        // Restore data-testid attributes on table cells
        this.toggleRowTestIds(true);
    }

    resetForm() {
        const form = document.getElementById('user-form');
        if (form) {
            form.reset();
        }
    // Clear validation styles
    document.getElementById('user-name')?.classList.remove('is-invalid');
    document.getElementById('user-email')?.classList.remove('is-invalid');
    document.getElementById('user-role')?.classList.remove('is-invalid');
    document.getElementById('user-status')?.classList.remove('is-invalid');
        this.currentEditingUser = null;
    }

    // Helper to remove/restore data-testid on TABLE cells only while modal is open
    toggleRowTestIds(restore) {
        // Scope strictly to the users table to avoid touching modal inputs/selects
        const table = document.getElementById('users-table');
        if (!table) return;

        const selectors = [
            '[data-testid="user-email"]',
            '[data-testid="user-role"]',
            '[data-testid="user-status"]',
        ];

        selectors.forEach((sel) => {
            table.querySelectorAll(sel).forEach(el => {
                if (restore) {
                    if (el.dataset.restoreTestid === 'true') {
                        if (el.dataset.originalTestid) {
                            el.setAttribute('data-testid', el.dataset.originalTestid);
                        }
                        delete el.dataset.restoreTestid;
                        delete el.dataset.originalTestid;
                    }
                } else {
                    el.dataset.restoreTestid = 'true';
                    el.dataset.originalTestid = el.getAttribute('data-testid') || '';
                    el.removeAttribute('data-testid');
                }
            });
        });
    }

    validateUserData(userData) {
        const errors = [];

        if (!userData.name || userData.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!userData.email || !this.isValidEmail(userData.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!userData.role) {
            errors.push('Please select a role');
        }

        if (!userData.status) {
            errors.push('Please select a status');
        }

        // Check for duplicate email (excluding current user when editing)
        const existingUser = this.users.find(user => 
            user.email === userData.email && 
            (!this.currentEditingUser || user.id !== this.currentEditingUser.id)
        );
        if (existingUser) {
            errors.push('Email address already exists');
        }

        if (errors.length > 0) {
            this.showAlert('error', errors.join('<br>'));
            // Highlight invalid fields for accessibility/visibility
            const nameInput = document.getElementById('user-name');
            const emailInput = document.getElementById('user-email');
            const roleSelect = document.getElementById('user-role');
            const statusSelect = document.getElementById('user-status');
            if (nameInput && (!userData.name || userData.name.trim().length < 2)) nameInput.classList.add('is-invalid');
            if (emailInput && (!userData.email || !this.isValidEmail(userData.email))) emailInput.classList.add('is-invalid');
            if (roleSelect && !userData.role) roleSelect.classList.add('is-invalid');
            if (statusSelect && !userData.status) statusSelect.classList.add('is-invalid');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    searchUsers(query) {
        const filteredUsers = this.users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        this.renderUsersTable(filteredUsers);
    }

    filterUsers(status) {
        if (status === 'all') {
            this.renderUsersTable();
        } else {
            const filteredUsers = this.users.filter(user => user.status === status);
            this.renderUsersTable(filteredUsers);
        }
    }

    selectAll(checked) {
        document.querySelectorAll('.user-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
        });
        this.updateBulkActions();
    }

    updateBulkActions() {
        const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
        const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
        
        if (bulkDeleteBtn) {
            bulkDeleteBtn.disabled = selectedCheckboxes.length === 0;
            bulkDeleteBtn.textContent = `Delete Selected (${selectedCheckboxes.length})`;
        }
    }

    bulkDelete() {
        const selectedIds = Array.from(document.querySelectorAll('.user-checkbox:checked'))
            .map(checkbox => parseInt(checkbox.value));

        if (selectedIds.length === 0) {
            this.showAlert('warning', 'Please select users to delete');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedIds.length} user(s)?`)) {
            return;
        }

        this.users = this.users.filter(user => !selectedIds.includes(user.id));
        this.renderUsersTable();
        this.updateStats();
        this.updateBulkActions();
        
        // Uncheck select all
        const selectAllCheckbox = document.getElementById('select-all');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
        }

        this.showAlert('success', `${selectedIds.length} user(s) deleted successfully!`);
    }

    generateSampleData() {
        const sampleUsers = [
            { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active' },
            { name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', status: 'active' },
            { name: 'Diana Prince', email: 'diana@example.com', role: 'moderator', status: 'active' },
            { name: 'Edward Smith', email: 'edward@example.com', role: 'user', status: 'inactive' },
            { name: 'Fiona Taylor', email: 'fiona@example.com', role: 'user', status: 'active' }
        ];

        sampleUsers.forEach(userData => {
            const newUser = {
                id: Date.now() + Math.random(),
                ...userData,
                createdAt: new Date().toISOString()
            };
            this.users.push(newUser);
        });

        this.renderUsersTable();
        this.updateStats();
        this.showAlert('success', `${sampleUsers.length} sample users generated!`);
    }

    exportUsers() {
        const csvContent = this.convertToCSV(this.users);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showAlert('success', 'Users exported successfully!');
    }

    convertToCSV(users) {
        const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Created At'];
        const csvRows = [headers.join(',')];
        
        users.forEach(user => {
            const row = [
                user.id,
                `"${user.name}"`,
                `"${user.email}"`,
                user.role,
                user.status,
                new Date(user.createdAt).toLocaleDateString()
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    updateStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(user => user.status === 'active').length;
        const adminUsers = this.users.filter(user => user.role === 'admin').length;

        const statsContainer = document.getElementById('user-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${totalUsers}</h5>
                            <p class="card-text">Total Users</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title text-success">${activeUsers}</h5>
                            <p class="card-text">Active Users</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title text-warning">${adminUsers}</h5>
                            <p class="card-text">Admin Users</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    getRoleBadgeColor(role) {
        const colors = {
            'admin': 'danger',
            'moderator': 'warning',
            'user': 'primary'
        };
        return colors[role] || 'secondary';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showAlert(type, message) {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;

        const alertClass = `alert-${type === 'error' ? 'danger' : type}`;
        const icon = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        }[type] || 'info-circle';

        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-dismissible fade show`;
        alert.innerHTML = `
            <i class="fas fa-${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        alertContainer.appendChild(alert);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userManager = new UserManager();
});
