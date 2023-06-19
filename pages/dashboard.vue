<template>
    <div>
        <section>
            <v-row class="mb-4 d-flex" id="card-row">
                <v-col cols="12" md="6">
                    <v-card class="full-height">
                        <v-card-title>Recent Transactions</v-card-title>
                        <v-card-text>
                            <v-list dense>
                                <v-list-item v-for="transaction in mostRecentTransactions" :key="transaction.id">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ transaction.description }}</v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ transaction.amount }} {{ transaction.currency }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6">
                    <v-card class="full-height">
                        <v-card-title>Most Common Categories</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <h3>Income</h3>
                                    <v-list dense>
                                        <v-list-item v-for="(category, index) in mostCommonIncomes" :key="index">
                                            <v-list-item-content>
                                                <v-list-item-title>{{ category.name }}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-col cols="6">
                                    <h3>Expense</h3>
                                    <v-list dense>
                                        <v-list-item v-for="(category, index) in mostCommonExpenses" :key="index">
                                            <v-list-item-content>
                                                <v-list-item-title>{{ category.name }}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </section>
        <section>
            <v-row>
                <v-col cols="12" md="4">
                    <v-card class="full-height">
                        <v-card-title>Recent Monthly Income</v-card-title>
                        <v-card-text>
                            <IncomeBarChart v-if="incomeChartData.datasets.length > 0" class="chart"
                                :chartDataset="incomeChartData" />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="full-height">
                        <v-card-title>Recent Monthly Expenses</v-card-title>
                        <v-card-text>
                            <ExpensesBarChart v-if="expenseChartData.datasets.length > 0" class="chart"
                                :chartDataset="expenseChartData" />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="full-height">
                        <v-card-title>Income/Expense Per Currency</v-card-title>
                        <v-card-text>
                            <HorizontalBar v-if="incomeExpenseChartData.datasets.length > 0" class="chart"
                                :chartDataset="incomeExpenseChartData" />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </section>
    </div>
</template>

<script>
import { Bar, HorizontalBar } from 'vue-chartjs';
import { TransactionsService } from '~/services/TransactionsService.js';

export default {
    name: 'Dashboard',
    data() {
        return {
            mostCommonIncomes: [],
            mostCommonExpenses: [],
            mostRecentTransactions: [],
            mostRecentMonthNames: [],
            recentIncomePerCurrencyDatasets: [],
            recentExpensePerCurrencyDatasets: [],
            totalIncomeExpensesDatasets: [],
            transactionsService: null,
        };
    },
    methods: {
        async fetchData() {
            try {
                this.mostRecentTransactions = await this.transactionsService.getMostRecentTransactions();
                const mostCommonCategories = await this.transactionsService.getMostCommonCategories();
                this.mostCommonIncomes = mostCommonCategories.filter(category => category.type == "INCOME");
                this.mostCommonExpenses = mostCommonCategories.filter(category => category.type == "EXPENSE");
                const transactionsLastThreeMonths = await this.transactionsService.getTransactionsLastThreeMonths();
                const totalAmountPerCurrencyByType = await this.transactionsService.getTotalAmountPerCurrencyByType();
                this.buildBarChartDatasets(transactionsLastThreeMonths, totalAmountPerCurrencyByType);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                this.showSnackbarError('Failed to fetch dashboard data');

            }
        },
        showSnackbarError(errorMessage) {
            this.$store.dispatch('snackbar/showSnackbarError', errorMessage);
        },
        setMostRecentMonthNames() {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const recentMonths = [];

            for (let i = 2; i >= 0; i--) {
                const monthIndex = (currentMonth - i + 12) % 12;
                const monthName = months[monthIndex];
                recentMonths.push(monthName);
            }
            this.mostRecentMonthNames = recentMonths;
        },
        buildBarChartDatasets(transactionsLastThreeMonths, totalAmountPerCurrencyByType) {
            const currencies = ['LBP', 'USD', 'EUR']
            let groupedTransactionsByMonth = this.groupTransactionsByMonth(transactionsLastThreeMonths);
            let incomeDatasets = [
                {
                    label: 'LBP',
                    backgroundColor: '#f87979',
                    data: [],
                },
                {
                    label: 'USD',
                    backgroundColor: '#79F899',
                    data: [],
                },
                {
                    label: 'EUR',
                    backgroundColor: '#7519CC',
                    data: [],
                },
            ];

            let expenseDatasets = [
                {
                    label: 'LBP',
                    backgroundColor: '#f87979',
                    data: [],
                },
                {
                    label: 'USD',
                    backgroundColor: '#79F899',
                    data: [],
                },
                {
                    label: 'EUR',
                    backgroundColor: '#7519CC',
                    data: [],
                },
            ];

            let expenseIncomeDataset = [
                {
                    label: 'LBP',
                    backgroundColor: ['#6DD230', '#E41A1A'],
                    data: [],
                },
                {
                    label: 'USD',
                    backgroundColor: ['#06BD4C', '#C90606'],
                    data: [],
                },
                {
                    label: 'EUR',
                    backgroundColor: ['#047C1E', '#9B1111'],
                    data: [],
                },
            ];

            currencies.forEach(currency => {
                let incomePerMonth = [];
                let expensePerMonth = [];

                this.mostRecentMonthNames.forEach(monthName => {
                    let monthsTransactions = groupedTransactionsByMonth[monthName];
                    let totalIncomePerMonth = (monthsTransactions || [])
                        .filter(transaction => transaction?.category?.type === 'INCOME' && transaction?.currency === currency)
                        .reduce((sum, transaction) => sum + transaction.amount, 0);
                    incomePerMonth.push(totalIncomePerMonth);

                    let totalExpensePerMonth = (monthsTransactions || [])
                        .filter(transaction => transaction?.category?.type === 'INCOME' && transaction?.currency === currency)
                        .reduce((sum, transaction) => sum + transaction.amount, 0);
                    expensePerMonth.push(totalExpensePerMonth);
                });

                incomeDatasets = incomeDatasets.map(dataset => {
                    if (dataset.label === currency) {
                        dataset.data = incomePerMonth;
                    }
                    return dataset;
                });

                expenseDatasets = expenseDatasets.map(dataset => {
                    if (dataset.label === currency) {
                        dataset.data = expensePerMonth;
                    }
                    return dataset;
                });



                expenseIncomeDataset = expenseIncomeDataset.map(dataset => {
                    if (dataset.label === currency) {
                        dataset.data = [
                            totalAmountPerCurrencyByType.find(amountByCurrencyAndType =>
                                amountByCurrencyAndType.currency === currency
                                && amountByCurrencyAndType.type === 'INCOME'
                            )?.totalAmount || 0,
                            totalAmountPerCurrencyByType.find(amountByCurrencyAndType =>
                                amountByCurrencyAndType.currency === currency
                                && amountByCurrencyAndType.type === 'EXPENSE'
                            )?.totalAmount || 0
                        ]
                    }
                    return dataset;
                });

            });


            this.totalIncomeExpensesDatasets = expenseIncomeDataset;
            this.recentIncomePerCurrencyDatasets = incomeDatasets;
            this.recentExpensePerCurrencyDatasets = expenseDatasets;
        },
        groupTransactionsByMonth(transactions) {
            const groupedTransactions = transactions.reduce((result, transaction) => {
                const transactionDate = new Date(transaction.date);
                const monthName = transactionDate.toLocaleString('default', { month: 'long' });

                if (!result[monthName]) {
                    result[monthName] = [];
                }

                result[monthName].push(transaction);
                return result;
            }, {});

            return groupedTransactions;
        }
    },
    computed: {
        incomeChartData() {
            const labels = this.mostRecentMonthNames;
            const datasets = this.recentIncomePerCurrencyDatasets.map((dataset) => ({
                label: dataset.label,
                backgroundColor: dataset.backgroundColor,
                data: dataset.data,
            }));

            return { labels, datasets };
        },
        expenseChartData() {
            const labels = this.mostRecentMonthNames;
            const datasets = this.recentExpensePerCurrencyDatasets.map((dataset) => ({
                label: dataset.label,
                backgroundColor: dataset.backgroundColor,
                data: dataset.data,
            }));

            return { labels, datasets };
        },
        incomeExpenseChartData() {
            const labels = ['INCOME', 'EXPENSE'];
            const datasets = this.totalIncomeExpensesDatasets.map((dataset) => ({
                label: dataset.label,
                backgroundColor: dataset.backgroundColor,
                data: dataset.data,
            }));

            return { labels, datasets };
        }
    },
    components: {
        ExpensesBarChart: {
            extends: Bar,
            props: ['chartDataset'],
            mounted() {
                if (this.chartDataset) {
                    this.renderChart(
                        {
                            labels: this.chartDataset.labels,
                            datasets: this.chartDataset.datasets,
                        },
                        {
                            responsive: true,
                        }
                    );
                }
            },
        },
        IncomeBarChart: {
            extends: Bar,
            props: ['chartDataset'],
            mounted() {
                if (this.chartDataset) {
                    this.renderChart(
                        {
                            labels: this.chartDataset.labels,
                            datasets: this.chartDataset.datasets,
                        },
                        {
                            responsive: true,
                        }
                    );
                }
            },
        },
        HorizontalBar: {
            extends: HorizontalBar,
            props: ['chartDataset'],
            mounted() {
                this.renderChart(
                    {
                        labels: this.chartDataset.labels,
                        datasets: this.chartDataset.datasets,
                    },
                    {
                        responsive: true,
                        tooltips: {
                            enabled: true,
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    const dataset = data.datasets[tooltipItem.datasetIndex];
                                    const label = dataset.label || '';
                                    const value = dataset.data[tooltipItem.index];
                                    return `${label}: ${value} `;
                                },
                            },
                        },
                    }
                );
            },
        },
    },
    mounted() {
        this.transactionsService = new TransactionsService(this.$apollo, this.$store);
        this.setMostRecentMonthNames();
        this.fetchData();
    }
};
</script>
  
<style scoped>
.mb-4 {
    margin-bottom: 4rem;
}

.full-height {
    height: 100%;
}
</style>
  