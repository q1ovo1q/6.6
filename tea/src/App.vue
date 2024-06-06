<template>
  <div id="app">
    <form id="form" @submit.prevent="sendData">
      <label>ID: <input type="text" name="id" v-model="id" readonly></label>
      <label>名称：<input type="text" name="name" v-model="name" /></label>
      <label>种类：<input type="text" name="type" v-model="type" /></label>
      <label>价格：<input type="text" name="price" v-model="price" /></label>
      <label>库存：<input type="text" name="stock" v-model="stock" /></label>
      <label>简介：<input type="text" name="description" v-model="description" /></label>
      <input type="submit" value="提交" class="getIN" />
    </form>
    <input type="text" id="sea_text" v-model="searchId" placeholder="根据id获取商品详情">
    <button id="search" @click="seek">查询</button>
    <table id="list">
      <thead>
        <tr id="one">
          <td><input type="checkbox" @click="selectAll"></td>
          <td>ID</td>
          <td>名称</td>
          <td>种类</td>
          <td>价格</td>
          <td>库存</td>
          <td>简介</td>
          <td>创建时间</td>
          <td>更新时间</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td><input type="checkbox"></td>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.description }}</td>
          <td>{{ formatDate(item.created_at) }}</td>
          <td>{{ formatDate(item.updated_at) }}</td>
          <td>
            <button @click="editItem(item)">编辑</button>
            <button @click="deleteItem(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      id: '',
      name: '',
      type: '',
      price: '',
      stock: '',
      description: '',
      created_at: '',
      updated_at: '',
      list: [],
      searchId: ''
    }
  },
  methods: {
    //发送数据
    sendData() {
      if (this.id) {
        this.updateItem();
      } else {
        this.addItem();
      }
    },
    //添加数据
    addItem() {
      const newItem = {
        name: this.name,
        type: this.type,
        price: this.price,
        stock: this.stock,
        description: this.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.axios.post('https://liu.zzgoodqc.cn/teas/', newItem)
        .then((res) => {
          this.list.push(res.data.data);
          this.clearForm();
        })
        .catch((error) => {
          console.error("添加报错！", error);
        });
    },
    //更新数据
    updateItem() {
      const updatedItem = {
        id: this.id,
        name: this.name,
        type: this.type,
        price: this.price,
        stock: this.stock,
        description: this.description,
        created_at: this.created_at,
        updated_at: new Date().toISOString(),
      };
      this.axios.put(`https://liu.zzgoodqc.cn/teas/${this.id}`, updatedItem)
        .then((res) => {
          const index = this.list.findIndex(item => item.id === this.id);
          if (index !== -1) {
            this.$set(this.list, index, res.data.data);
          }
          this.clearForm();
        })
        .catch((error) => {
          console.error("更新报错！", error);
        });
    },
    //查找数据
    seek() {
      this.axios.get(`https://liu.zzgoodqc.cn/teas/${this.searchId}`)
        .then((res) => {
          this.list = [res.data.data];
        })
        .catch((error) => {
          console.error("查询报错！", error);
        });
    },
    //删除数据
    deleteItem(id) {
      this.axios.delete(`https://liu.zzgoodqc.cn/teas/${id}`)
        .then(() => {
          this.list = this.list.filter(item => item.id !== id);
        })
        .catch((error) => {
          console.error("删除报错！", error);
        });
    },
    //全选
    selectAll() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const selectAllCheckbox = checkboxes[0];
      const isChecked = selectAllCheckbox.checked;

      checkboxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
    },
    //编辑
    editItem(item) {
      this.id = item.id;
      this.name = item.name;
      this.type = item.type;
      this.price = item.price;
      this.stock = item.stock;
      this.description = item.description;
      this.created_at = item.created_at;
      this.updated_at = item.updated_at;
    },
    //
    clearForm() {
      this.id = '';
      this.name = '';
      this.type = '';
      this.price = '';
      this.stock = '';
      this.description = '';
      this.created_at = '';
      this.updated_at = '';
    },
    formatDate(date) {
      if (!date) return '';
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      return new Date(date).toLocaleDateString('zh-CN', options);
    }
  },
  mounted() {
    this.axios.get('https://liu.zzgoodqc.cn/teas')
      .then((res) => {
        this.list = res.data.data;
      })
      .catch((error) => {
        console.error("初始化报错!", error);
      });
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

form label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

form input[type="text"],
form input[type="submit"] {
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form input[type="submit"] {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

form input[type="submit"]:hover {
  background-color: #45a049;
}

#sea_text {
  padding: 10px;
  margin: 20px 0;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#search {
  padding: 10px 20px;
  background-color: #008CBA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#search:hover {
  background-color: #007bb5;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #f2f2f2;
}

table,
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}

img {
  width: 100px;
  height: 100px;
}
</style>
