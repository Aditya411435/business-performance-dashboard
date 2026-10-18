// ======================================
// 1. DUMMY DATA
// ======================================

const customers = [
    "ABC Technologies",
    "Global Solutions",
    "Smart India Pvt Ltd",
    "Future Digital",
    "Tech Vision",
    "Bright Systems",
    "Innovative Services",
    "Digital World",
    "Prime Networks",
    "NextGen Solutions",
    "Cloud Nine Technologies",
    "Vertex Consulting",
    "Greenfield Systems",
    "BlueSky Digital",
    "Apex Innovations"
];

const services = [
    "Private Limited",
    "LLP Registration",
    "GST",
    "Trademark",
    "ISO Certification",
    "Annual Compliance"
];

const users = [
    "Nancy Singh",
    "Sneha Choudhary",
    "Tannu Kumari"
];

const leadStatuses = [
    "Qualified",
    "Converted",
    "Unqualified"
];

const orderStatuses = [
    "Pending",
    "In Progress",
    "Completed",
    "On Hold"
];

const leads = [];

const today = new Date();

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
    return array[randomInt(0, array.length - 1)];
}

function dateDaysAgo(days) {
    const date = new Date(today);
    date.setDate(date.getDate() - days);

    return date;
}

function money(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
}


// Generate 200 sample business records.

for (let i = 1; i <= 200; i++) {

    const createdDate = dateDaysAgo(randomInt(0, 119));

    const status = randomItem(leadStatuses);

    const dealCreated = status === "Converted";

    const quotationValue = randomInt(5000, 50000);

    const dealValue = dealCreated
        ? quotationValue
        : 0;

    const collectedRevenue = dealCreated
        ? randomInt(0, dealValue)
        : 0;

    leads.push({
        id: i,

        customer: randomItem(customers),

        service: randomItem(services),

        status: status,

        source: randomItem([
            "Google Ads",
            "Website",
            "Referral",
            "Just Dial"
        ]),

        priority: randomItem([
            "High",
            "Medium",
            "Low"
        ]),

        quotationValue: quotationValue,

        dealValue: dealValue,

        collectedRevenue: collectedRevenue,

        orderStatus: dealCreated
            ? randomItem(orderStatuses)
            : "Not Created",

        user: randomItem(users),

        department: dealCreated
            ? "Operations"
            : "Sales",

        createdDate: createdDate
    });
}


// ======================================
// 2. CHART CONFIGURATION
// ======================================

const chartInstances = {};

function createChart(id, type, labels, datasets, options = {}) {

    const canvas = document.getElementById(id);

    if (chartInstances[id]) {
        chartInstances[id].destroy();
    }

    chartInstances[id] = new Chart(canvas, {
        type: type,

        data: {
            labels: labels,
            datasets: datasets
        },

        options: {
            responsive: true,

            maintainAspectRatio: true,

            plugins: {
                legend: {
                    display: true,
                    position: "bottom"
                }
            },

            ...options
        }
    });
}


// ======================================
// 3. FILTER DATA
// ======================================

let activeStartDate = dateDaysAgo(29);

let activeEndDate = new Date(today);

function getFilteredData() {

    const selectedUser =
        document.getElementById("userFilter").value;

    const selectedDepartment =
        document.getElementById("departmentFilter").value;

    return leads.filter(lead => {

        const leadDate = new Date(lead.createdDate);

        const start = new Date(activeStartDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(activeEndDate);
        end.setHours(23, 59, 59, 999);

        const matchesDate =
            leadDate >= start &&
            leadDate <= end;

        const matchesUser =
            selectedUser === "all" ||
            lead.user === selectedUser;

        const matchesDepartment =
            selectedDepartment === "all" ||
            lead.department === selectedDepartment;

        return matchesDate &&
            matchesUser &&
            matchesDepartment;
    });
}


// ======================================
// 4. KPI CALCULATIONS
// ======================================

function updateKPIs(data) {

    const total = data.length;

    const qualified = data.filter(
        item => item.status === "Qualified"
    ).length;

    const converted = data.filter(
        item => item.status === "Converted"
    ).length;

    const unqualified = data.filter(
        item => item.status === "Unqualified"
    ).length;

    const quotations = data.length;

    const deals = data.filter(
        item => item.dealValue > 0
    ).length;

    const revenue = data.reduce(
        (sum, item) => sum + item.dealValue,
        0
    );

    const qualifiedPercent = total
        ? (qualified / total * 100).toFixed(1)
        : 0;

    const convertedPercent = total
        ? (converted / total * 100).toFixed(1)
        : 0;

    const unqualifiedPercent = total
        ? (unqualified / total * 100).toFixed(1)
        : 0;

    const conversionRate = total
        ? (converted / total * 100).toFixed(1)
        : 0;

    document.getElementById("totalLeads").textContent =
        total;

    document.getElementById("qualifiedLeads").textContent =
        qualified;

    document.getElementById("convertedLeads").textContent =
        converted;

    document.getElementById("unqualifiedLeads").textContent =
        unqualified;

    document.getElementById("qualifiedPercent").textContent =
        qualifiedPercent + "% Qualified";

    document.getElementById("convertedPercent").textContent =
        convertedPercent + "% Conversion";

    document.getElementById("unqualifiedPercent").textContent =
        unqualifiedPercent + "% Unqualified";

    document.getElementById("conversionRate").textContent =
        conversionRate + "%";

    document.getElementById("totalQuotations").textContent =
        quotations;

    document.getElementById("totalDeals").textContent =
        deals;

    document.getElementById("totalRevenue").textContent =
        money(revenue);
}


// ======================================
// 5. LEAD ANALYTICS
// ======================================

function updateLeadCharts(data) {

    const qualified = data.filter(
        item => item.status === "Qualified"
    ).length;

    const converted = data.filter(
        item => item.status === "Converted"
    ).length;

    const unqualified = data.filter(
        item => item.status === "Unqualified"
    ).length;


    // Lead funnel

    createChart(
        "leadFunnelChart",
        "bar",
        ["New Leads", "Qualified", "Converted", "Unqualified"],
        [{
            label: "Lead Count",

            data: [
                data.length,
                qualified,
                converted,
                unqualified
            ],

            backgroundColor: [
                "#2563eb",
                "#10b981",
                "#f59e0b",
                "#ef4444"
            ]
        }],
        {
            indexAxis: "y",

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    );


    // Daily lead trend

    const trendLabels = [];
    const totalTrend = [];
    const qualifiedTrend = [];
    const convertedTrend = [];

    for (let i = 6; i >= 0; i--) {

        const date = dateDaysAgo(i);

        trendLabels.push(
            date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
            })
        );

        const sameDay = data.filter(item =>
            new Date(item.createdDate).toDateString() ===
            date.toDateString()
        );

        totalTrend.push(sameDay.length);

        qualifiedTrend.push(
            sameDay.filter(
                item => item.status === "Qualified"
            ).length
        );

        convertedTrend.push(
            sameDay.filter(
                item => item.status === "Converted"
            ).length
        );
    }

    createChart(
        "leadTrendChart",
        "line",
        trendLabels,
        [
            {
                label: "New Leads",
                data: totalTrend,
                borderColor: "#2563eb",
                tension: 0.3
            },
            {
                label: "Qualified",
                data: qualifiedTrend,
                borderColor: "#10b981",
                tension: 0.3
            },
            {
                label: "Converted",
                data: convertedTrend,
                borderColor: "#f59e0b",
                tension: 0.3
            }
        ]
    );


    // Lead source chart

    const sources = [
        "Google Ads",
        "Website",
        "Referral",
        "Just Dial"
    ];

    const sourceCounts = sources.map(source =>
        data.filter(item => item.source === source).length
    );

    createChart(
        "leadSourceChart",
        "doughnut",
        sources,
        [{
            data: sourceCounts,

            backgroundColor: [
                "#2563eb",
                "#10b981",
                "#f59e0b",
                "#8b5cf6"
            ]
        }]
    );
}


// ======================================
// 6. QUOTATION ANALYTICS
// ======================================

function updateQuotationCharts(data) {

    const serviceCounts = services.map(service =>
        data.filter(item => item.service === service).length
    );

    const serviceValues = services.map(service =>
        data
            .filter(item => item.service === service)
            .reduce(
                (sum, item) => sum + item.quotationValue,
                0
            )
    );


    createChart(
        "quotationServiceChart",
        "bar",
        services,
        [{
            label: "Quotations",
            data: serviceCounts,
            backgroundColor: "#2563eb"
        }],
        {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    );


    createChart(
        "quotationValueChart",
        "bar",
        services,
        [{
            label: "Quotation Value (₹)",
            data: serviceValues,
            backgroundColor: "#06b6d4"
        }],
        {
            indexAxis: "y",

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    );


    const quotationCount = data.length;

    const convertedCount = data.filter(
        item => item.dealValue > 0
    ).length;

    const pendingCount = quotationCount - convertedCount;

    createChart(
        "quotationConversionChart",
        "doughnut",
        ["Converted", "Not Converted"],
        [{
            data: [
                convertedCount,
                pendingCount
            ],

            backgroundColor: [
                "#2563eb",
                "#e2e8f0"
            ]
        }]
    );
}


// ======================================
// 7. DEALS AND REVENUE
// ======================================

function updateRevenueCharts(data) {

    const dealsByService = services.map(service =>
        data.filter(
            item =>
                item.service === service &&
                item.dealValue > 0
        ).length
    );

    createChart(
        "dealsChart",
        "bar",
        services,
        [{
            label: "Deals",
            data: dealsByService,
            backgroundColor: "#2563eb"
        }]
    );


    // Daily revenue

    const labels = [];
    const revenueValues = [];
    const collectedValues = [];

    for (let i = 6; i >= 0; i--) {

        const date = dateDaysAgo(i);

        labels.push(
            date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
            })
        );

        const sameDay = data.filter(item =>
            new Date(item.createdDate).toDateString() ===
            date.toDateString()
        );

        revenueValues.push(
            sameDay.reduce(
                (sum, item) => sum + item.dealValue,
                0
            )
        );

        collectedValues.push(
            sameDay.reduce(
                (sum, item) => sum + item.collectedRevenue,
                0
            )
        );
    }


    createChart(
        "revenueTrendChart",
        "line",
        labels,
        [
            {
                label: "Deal Revenue",
                data: revenueValues,
                borderColor: "#2563eb",
                tension: 0.3
            },
            {
                label: "Collected Revenue",
                data: collectedValues,
                borderColor: "#10b981",
                tension: 0.3
            }
        ]
    );


    // Revenue totals

    const totalDealValue = data.reduce(
        (sum, item) => sum + item.dealValue,
        0
    );

    const totalCollected = data.reduce(
        (sum, item) => sum + item.collectedRevenue,
        0
    );

    const outstanding = totalDealValue - totalCollected;


    document.getElementById("dealValue").textContent =
        money(totalDealValue);

    document.getElementById("collectedRevenue").textContent =
        money(totalCollected);

    document.getElementById("outstandingRevenue").textContent =
        money(outstanding);


    // Priority breakdown

    const priorities = ["High", "Medium", "Low"];

    const priorityValues = priorities.map(priority =>
        data
            .filter(
                item =>
                    item.priority === priority &&
                    item.dealValue > 0
            )
            .reduce(
                (sum, item) => sum + item.dealValue,
                0
            )
    );

    createChart(
        "priorityChart",
        "bar",
        priorities,
        [{
            label: "Deal Value (₹)",
            data: priorityValues,
            backgroundColor: [
                "#ef4444",
                "#f59e0b",
                "#10b981"
            ]
        }]
    );
}


// ======================================
// 8. ORDERS AND PAYMENTS
// ======================================

function updateOrderCharts(data) {

    const orders = data.filter(
        item => item.dealValue > 0
    );

    const statuses = [
        "Pending",
        "In Progress",
        "Completed",
        "On Hold"
    ];

    const orderCounts = statuses.map(status =>
        orders.filter(
            item => item.orderStatus === status
        ).length
    );

    createChart(
        "orderStatusChart",
        "doughnut",
        statuses,
        [{
            data: orderCounts,

            backgroundColor: [
                "#f59e0b",
                "#2563eb",
                "#10b981",
                "#ef4444"
            ]
        }]
    );


    const collected = data.reduce(
        (sum, item) => sum + item.collectedRevenue,
        0
    );

    const outstanding = data.reduce(
        (sum, item) => sum + item.dealValue,
        0
    ) - collected;

    createChart(
        "paymentChart",
        "doughnut",
        ["Collected", "Outstanding"],
        [{
            data: [
                collected,
                outstanding
            ],

            backgroundColor: [
                "#10b981",
                "#f59e0b"
            ]
        }]
    );
}


// ======================================
// 9. BUSINESS DETAILS TABLE
// ======================================

function updateTable(data) {

    const tbody = document.getElementById("businessTable");

    tbody.innerHTML = "";

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = data.filter(item => {

        const text = [
            item.customer,
            item.service,
            item.status,
            item.orderStatus,
            item.user
        ].join(" ").toLowerCase();

        return text.includes(search);
    });

    filtered.forEach(item => {

        const row = document.createElement("tr");

        const cells = [
            item.customer,
            item.service,
            item.status,
            money(item.quotationValue),
            money(item.dealValue),
            money(item.collectedRevenue),
            item.orderStatus,
            item.user
        ];

        cells.forEach((value, index) => {

            const cell = document.createElement("td");

            if (index === 2 || index === 6) {

                const badge = document.createElement("span");

                badge.className = "status";

                badge.textContent = value;

                cell.appendChild(badge);

            } else {

                cell.textContent = value;
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    document.getElementById("recordCount").textContent =
        `Showing ${filtered.length} of ${data.length} records`;
}


// ======================================
// 10. REFRESH DASHBOARD
// ======================================

function refreshDashboard() {

    const data = getFilteredData();

    updateKPIs(data);

    updateLeadCharts(data);

    updateQuotationCharts(data);

    updateRevenueCharts(data);

    updateOrderCharts(data);

    updateTable(data);
}


// ======================================
// 11. DATE FILTERS
// ======================================

document.getElementById("dateFilter")
    .addEventListener("change", function () {

        const value = this.value;

        const customDates =
            document.getElementById("customDates");

        customDates.hidden = value !== "custom";

        if (value === "custom") {
            return;
        }

        activeEndDate = new Date(today);

        if (value === "today") {

            activeStartDate = new Date(today);

        } else {

            activeStartDate = dateDaysAgo(
                Number(value) - 1
            );
        }

        refreshDashboard();
    });


document.getElementById("applyDates")
    .addEventListener("click", function () {

        const start = document.getElementById("startDate").value;

        const end = document.getElementById("endDate").value;

        if (!start || !end) {
            alert("Please select both start and end dates.");
            return;
        }

        const startDate = new Date(start + "T00:00:00");

        const endDate = new Date(end + "T00:00:00");

        if (startDate > endDate) {
            alert("The start date must be before the end date.");
            return;
        }

        activeStartDate = startDate;

        activeEndDate = endDate;

        refreshDashboard();
    });


// ======================================
// 12. USER AND DEPARTMENT FILTERS
// ======================================

document.getElementById("userFilter")
    .addEventListener("change", refreshDashboard);

document.getElementById("departmentFilter")
    .addEventListener("change", refreshDashboard);


// ======================================
// 13. TABLE SEARCH
// ======================================

document.getElementById("searchInput")
    .addEventListener("input", function () {

        updateTable(getFilteredData());
    });


// ======================================
// 14. EXPORT CSV
// ======================================

document.getElementById("exportBtn")
    .addEventListener("click", function () {

        const data = getFilteredData();

        const headers = [
            "Customer",
            "Service",
            "Lead Status",
            "Source",
            "Priority",
            "Quotation Value",
            "Deal Value",
            "Collected Revenue",
            "Order Status",
            "User",
            "Department",
            "Created Date"
        ];

        const rows = data.map(item => [
            item.customer,
            item.service,
            item.status,
            item.source,
            item.priority,
            item.quotationValue,
            item.dealValue,
            item.collectedRevenue,
            item.orderStatus,
            item.user,
            item.department,
            item.createdDate.toLocaleDateString("en-IN")
        ]);

        function escapeCSV(value) {

            return '"' +
                String(value).replace(/"/g, '""') +
                '"';
        }

        const csv = [
            headers,
            ...rows
        ]
            .map(row => row.map(escapeCSV).join(","))
            .join("\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "business-analytics.csv";

        link.click();

        URL.revokeObjectURL(url);
    });


// ======================================
// 15. START APPLICATION
// ======================================

refreshDashboard();
