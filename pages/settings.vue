<template>
    <div class="settings">
        <h1>Settings</h1>

        <!-- User Information -->
        <div class="section">
            <h2>User Information</h2>
            <div class="form-row">
                <div class="form-label">Name:</div>
                <div class="form-field">
                    <p class="field-value">{{ user.name }}</p>
                </div>
            </div>
            <div class="form-row">
                <div class="form-label">Email:</div>
                <div class="form-field">
                    <p class="field-value">{{ user.email }}</p>
                </div>
            </div>
            <div class="form-actions">
                <v-btn color="primary" :disabled="userInfoEditMode" @click="editUserInformation">Edit</v-btn>
            </div>
        </div>

        <!-- Edit User Information Form -->
        <v-form v-if="userInfoEditMode" class="edit-form">
            <div class="form-row">
                <div class="form-field">
                    <v-text-field v-model="editUser.name" label="Name" required></v-text-field>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <v-text-field v-model="editUser.email" label="Email" required></v-text-field>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <v-text-field v-model="editUser.password" label="Password" type="password" required></v-text-field>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <v-text-field v-model="editUser.confirmPassword" label="Confirm Password" type="password"
                        required></v-text-field>
                </div>
            </div>

            <div class="form-actions">
                <v-btn color="primary" @click="saveUserInformation">Save</v-btn>
                <v-btn @click="cancelUserEdit">Cancel</v-btn>
            </div>
        </v-form>
        <section>
            <h2>Categories</h2>
            <template>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-toolbar dark>
                            <v-toolbar-title>
                                <span>{{ "EXPENSE" }}</span>
                                <v-icon color="red">mdi-cash-minus</v-icon>
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="addCategory('EXPENSE')">Add Category</v-btn>
                        </v-toolbar>
                        <!-- EXPENSE Categories Table -->
                        <v-data-table :headers="tableHeaders" :items="getExpenseCategories()" item-key="id"
                            hide-default-footer :items-per-page="-1">
                            <template v-slot:item.actions="{ item }">
                                <div class="actions-column">
                                    <v-btn icon color="primary" class="edit-button" @click="editCategory(item)">
                                        <v-icon>mdi-pencil-outline</v-icon>
                                    </v-btn>
                                    <v-btn icon color="error" class="remove-button" @click="openRemoveCategoryDialog(item)">
                                        <v-icon>mdi-delete-outline</v-icon>
                                    </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-toolbar dark>
                            <v-toolbar-title>
                                <span>{{ "INCOME" }}</span>
                                <v-icon color="green">mdi-cash-plus</v-icon>
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="addCategory('INCOME')">Add Category</v-btn>
                        </v-toolbar>
                        <!-- INCOME Categories Table -->
                        <v-data-table :headers="tableHeaders" :items="getIncomeCategories()" item-key="id"
                            hide-default-footer :items-per-page="-1">
                            <template v-slot:item.actions="{ item }">
                                <div class="actions-column">
                                    <v-btn icon color="primary" class="edit-button" @click="editCategory(item)">
                                        <v-icon>mdi-pencil-outline</v-icon>
                                    </v-btn>
                                    <v-btn icon color="error" class="remove-button" @click="openRemoveCategoryDialog(item)">
                                        <v-icon>mdi-delete-outline</v-icon>
                                    </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
                <!-- Edit Category Modal -->
                <v-dialog v-model="isEditMode" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span>{{ this.editedCategory.id != null ? "Edit Category" : "Add Category" }}</span>
                        </v-card-title>
                        <v-card-text class="py-4">
                            <v-form @submit.prevent="saveEditedCategory">
                                <v-text-field v-model="editedCategory.name" label="Category Name" required></v-text-field>
                                <v-select v-model="editedCategory.type" :items="categoryTypes" label="Category Type"
                                    required></v-select>
                                <v-btn color="primary" type="submit">Save</v-btn>
                                <v-btn @click="cancelEdit">Cancel</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <ConfirmationDialog :showDialog="showRemoveConfirmation" @cancel="cancelRemoveCategoryDialog"
                    @confirm="removeCategory" title="Removing Category"
                    message="Are you sure you want to remove this category?" />
            </template>
        </section>

    </div>
</template>
  
<style scoped>
.actions-column {
    display: flex;
    justify-content: flex-end;
}

tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
    /* Adjust the opacity value to control the color change */
}

.settings {
    max-width: 50rem;
    margin: 0 auto;
    padding: 1.25rem;
}

.section {
    margin-bottom: 1.875rem;
}

h1 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
}

h2 {
    font-size: 1.25rem;
    margin-bottom: 0.625rem;
}

.form-row {
    display: flex;
    align-items: center;
    margin-bottom: 0.625rem;
}

.form-label {
    font-weight: bold;
    width: 8rem;
    flex-shrink: 0;
}

.form-field {
    flex: 1;
}

.form-actions {
    margin-top: 1.25rem;
    display: flex;
    justify-content: flex-end;
}

.edit-form {
    margin-top: 1.875rem;
}

.v-text-field {
    width: 100%;
}

.v-btn {
    margin-left: 0.625rem;
}

.field-value {
    margin: 0;
    vertical-align: middle;
}

@media (max-width: 30rem) {
    .form-label {
        width: auto;
    }
}
</style>
  
<script>
import { CategoriesService } from '~/services/CategoriesService.js';
import { UsersService } from '~/services/UsersService';
import ConfirmationDialog from '~/components/ConfirmationDialog.vue';

export default {
    components: {
        ConfirmationDialog,
    },
    data() {
        return {
            categories: [],
            categoryTypes: [],
            categoryToRemove: null,
            showRemoveConfirmation: false,
            isEditMode: false,
            editedCategory: {
                id: null,
                name: '',
                type: ''
            },
            user: {
                id: null,
                name: '',
                email: '',
            },
            editUser: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            userInfoEditMode: false,
            tableHeaders: [
                { text: 'Name', value: 'name' },
                { text: '', value: 'actions', sortable: false },
            ],
            categoriesService: null,
            usersService: null,
        };
    },
    methods: {
        editUserInformation() {
            this.editUser.name = this.user.name;
            this.editUser.email = this.user.email;
            this.userInfoEditMode = true;
        },
        getExpenseCategories() {
            return (this.categories || []).filter(category => category.type === 'EXPENSE');
        },
        getIncomeCategories() {
            return (this.categories || []).filter(category => category.type === 'INCOME');
        },
        async saveUserInformation() {
            try {
                if (!this.validateForm()) {
                    return;
                }

                let body = {
                    name: this.editUser.name,
                    email: this.editUser.email,
                    password: this.editUser.password ? this.editUser.password : null
                }

                const updatedUser = await this.usersService.updateUser(body)

                this.user.name = updatedUser.name;
                this.user.email = updatedUser.email;

                this.userInfoEditMode = false;
            } catch (error) {
                console.error("Unable to update user information: ", error)
                this.showSnackbarError(error.message)
            }
        },
        cancelUserEdit() {
            this.editUser.name = '';
            this.editUser.email = '';
            this.userInfoEditMode = false;
        },
        async fetchData() {
            try {
                this.user = await this.usersService.getUser();
                this.categories = await this.categoriesService.getCategories();
                this.categoryTypes = await this.categoriesService.getCategoryTypes();
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                this.showSnackbarError('Failed to fetch categories');
            }
        },
        validateForm() {
            if (!this.editUser.name) {
                this.showSnackbarError("Please enter a name.");
                return false;
            }

            if (!this.editUser.email) {
                this.showSnackbarError("Please enter an email.");
                return false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.editUser.email)) {
                this.showSnackbarError("Please enter a valid email.");
                return false;
            }

            if (this.editUser.password) {
                if (this.editUser.password.length < 6) {
                    this.showSnackbarError("Password should be at least 6 characters long.");
                    return false;
                }

                if (this.editUser.password !== this.editUser.confirmPassword) {
                    this.showSnackbarError("Passwords do not match.");
                    return false;
                }
            }
            return true;
        },
        openRemoveCategoryDialog(categoryToRemove) {
            this.categoryToRemove = categoryToRemove;
            this.showRemoveConfirmation = true;
        },
        cancelRemoveCategoryDialog() {
            this.categoryToRemove = null;
            this.showRemoveConfirmation = false;
        },
        async addCategory(type) {
            try {
                this.cancelEdit();

                this.editedCategory = {
                    id: null,
                    name: '',
                    type: type ? type : ''
                };
                this.isEditMode = true;
            } catch (error) {
                console.error('Failed to add category:', error);
                this.showSnackbarError('Failed to add category');
            }
        },
        editCategory(category) {
            this.editedCategory = { ...category };
            this.isEditMode = true;
        },
        async saveEditedCategory() {
            try {
                let body = {
                    name: this.editedCategory.name,
                    type: this.editedCategory.type
                }
                if (this.editedCategory.id) {
                    const updatedCategory = await this.categoriesService.updateCategory(
                        parseInt(this.editedCategory.id),
                        body
                    );

                    this.categories = (this.categories || []).map(category => {
                        if (category.id == updatedCategory.id) {
                            return updatedCategory;
                        } else {
                            return category;
                        }
                    });
                } else {
                    const createdCategory = await this.categoriesService.createCategory(body);
                    this.categories = [createdCategory, ...this.categories];
                }

                this.cancelEdit();

            } catch (error) {
                console.error('Failed to save category:', error);
                this.showSnackbarError('Failed to save category');
            }
        },
        cancelEdit() {
            this.editedCategory = {
                id: null,
                name: '',
                type: ''
            };
            this.isEditMode = false;
        },
        async removeCategory() {
            try {
                if (this.categoryToRemove) {
                    const removedCategory = await this.categoriesService.removeCategory(parseInt(this.categoryToRemove.id));
                    this.categories = (this.categories || []).filter(category => category.id !== removedCategory.id);
                    this.categoryToRemove = null;
                    this.showRemoveConfirmation = false;
                }
            } catch (error) {
                this.categoryToRemove = null;
                this.showRemoveConfirmation = false;
                console.error('Failed to remove category:', error);
                this.showSnackbarError('Failed to remove category');
            }
        },
        showSnackbarError(errorMessage) {
            this.$store.dispatch('snackbar/showSnackbarError', errorMessage);
        },
    },
    mounted() {
        this.categoriesService = new CategoriesService(this.$apollo, this.$store);
        this.usersService = new UsersService(this.$apollo, this.$store);
        this.fetchData();
    }
};
</script>
