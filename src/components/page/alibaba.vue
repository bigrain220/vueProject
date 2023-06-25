<template>
    <div class="merchant-container">
        <el-row>
            <el-col :span="20">
                <el-form :inline="true" :model="queryForm" @submit.prevent>
                    <el-form-item label="地区：" label-width="60px">
                        <el-cascader
                            v-model="queryForm.area"
                            clearable
                            filterable
                            :options="area"
                            :props="{ label: 'name', value: 'code', checkStrictly: true }"
                        />
                    </el-form-item>
                    <!--          <el-form-item label="行业：" label-width="60px">-->
                    <!--            <el-cascader-->
                    <!--              v-model="queryForm.category"-->
                    <!--              clearable-->
                    <!--              filterable-->
                    <!--              :options="category_options"-->
                    <!--              :props="{ label: 'label', value: 'value', checkStrictly: true }"-->
                    <!--            />-->
                    <!--          </el-form-item>-->
                    <el-form-item label="搜索：" label-width="60px">
                        <el-input v-model="queryForm.keyword" placeholder="关键词" />
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="queryData"> 查询 </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="handleExport"> 导出 </el-button>
                        <el-button icon="el-icon-search" type="primary" @click="handleDelete"> 标记 </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-table v-loading="listLoading" :data="list" @selection-change="setSelectRows">
            <el-table-column show-overflow-tooltip type="selection" />
            <el-table-column label="公司名称" width="300px">
                <template #default="{ row }">
                    <div>ID:{{ row.no }}</div>
                    <div>Company Name:{{ row.company_name || '-' }}</div>
                    <div>公司名称：{{ row.company_name_zh || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="厂家详情">
                <template #default="{ row }">
                    <div>Product：{{ row.product || '-' }}</div>
                    <div>产品：{{ row.product_zh || '-' }}</div>
                    <div>Business：{{ row.business || '-' }}</div>
                    <div>主营：{{ row.business_zh || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="联系方式">
                <template #default="{ row }">
                    <div class="contact_name">
                        联系人:
                        <el-tag v-if="row.sign_time">{{ row.contact_name || '-' }}</el-tag>
                        <el-tag v-else type="info">{{ row.contact_name || '-' }}</el-tag>
                    </div>
                    <div class="contact_name">
                        联系方式1:
                        <el-tag v-if="row.sign_time">{{ row.tel || '-' }}</el-tag>
                        <el-tag v-else type="info">{{ row.tel || '-' }}</el-tag>
                    </div>
                    <div class="contact_name">
                        联系方式2:
                        <el-tag v-if="row.sign_time">{{ row.mobile || '-' }}</el-tag>
                        <el-tag v-else type="info">{{ row.mobile || '-' }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="地址">
                <template #default="{ row }">
                    <div>{{ row.operation_address || '-' }}</div>
                    <div>{{ row.operation_address_zh || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最近查看时间">
                <template #default="{ row }">
                    <div>{{ row.view_time || '未查看' }}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100">
                <template #default="{ row }">
                    <el-button v-if="row.sign_time" link type="danger" @click="handleDelete(row, '取消')"> 取消 </el-button>
                    <el-button v-else link type="info" @click="handleDelete(row, '')"> 标记 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            :current-page="queryForm.pageNo"
            :layout="layout"
            :page-size="queryForm.pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
        <!-- <edit ref="editRef" @fetch-data="fetchData" /> -->
    </div>
</template>
<script>
import { getList, doDelete, getCategoryOptions, doExportExcel } from '@/api/merchant';
// import Edit from './components/MerchantEdit';
import { getAreaOptions } from '@/utils/area';
// import { baseURL } from '@/config';
var baseURL = '';

export default {
    name: 'Alibaba',
    // components: { Edit },
    data() {
        return {
            editRef: null,
            list: [],
            listLoading: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            total: 0,
            selectRows: '',
            queryForm: {
                pageNo: 1,
                pageSize: 15,
                keyword: '',
                type: [],
                area: [],
                source: 1
            },
            area: getAreaOptions(),
            category_options: []
        };
    },
    methods: {
        setSelectRows(val) {
            this.selectRows = val;
        },
        async handleExport() {
            this.listLoading = true;
            const {
                data: { url }
            } = await doExportExcel(this.queryForm);
            window.open(baseURL + url, '_blank');
            this.listLoading = false;
        },
        handleDelete(row, flag = '') {
            if (row.id) {
                this.$confirm('你确定要' + flag + '标记当前项吗', null, async () => {
                    const { msg } = await doDelete({ ids: row.id });
                    this.$message(msg, 'success', 'vab-hey-message-success');
                    await this.fetchData();
                });
            } else {
                if (this.selectRows.length > 0) {
                    const ids = this.selectRows.map((item) => item.id).join();
                    this.$confirm('你确定要' + flag + '标记选中项吗', null, async () => {
                        const { msg } = await doDelete({ ids });
                        this.$message(msg, 'success', 'vab-hey-message-success');
                        await this.fetchData();
                    });
                } else {
                    this.$message('未选中任何行', 'error', 'vab-hey-message-error');
                }
            }
        },
        handleSizeChange(val) {
            this.queryForm.pageSize = val;
            this.fetchData();
        },
        handleCurrentChange(val) {
            this.queryForm.pageNo = val;
            this.fetchData();
        },
        queryData() {
            this.queryForm.pageNo = 1;
            this.fetchData();
        },
        async fetchData() {
            this.listLoading = true;
            const {
                data: { list, total }
            } = await getList(this.queryForm);
            this.list = list;
            this.total = total;
            this.listLoading = false;
        },
        async fetchCategoryOptions() {
            const { data } = await getCategoryOptions();
            this.category_options = data;
        }
    },
    mounted() {
        this.fetchData();
        this.fetchCategoryOptions();
    }
};
</script>
<style lang="scss" scoped>
::v-deep {
    .el-input.el-input--default.el-pagination__editor.is-in-pagination {
        width: 100px;
    }
}

.contact_name {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #000;

    .el-tag {
        color: #000;
    }
}
</style>
