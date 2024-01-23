Vue.component('kanban-column', {
    props: ['column', 'isFirstColumn'],
    template: `
      <div class="column">
        <h3>{{ column.name }}</h3>
        <div class="card" v-for="(card, cardIndex) in column.cards" :key="cardIndex">
          <h4>Название: {{ card.title }}</h4>
          <p>Создано: {{ card.created }}</p>
          <p>Описание: {{ card.description }}</p>
          <p>Дедлайн до: {{ card.deadline }}</p>
          <p>{{ card.completedOnTime }}</p>
          <p v-if="card.returned">Причина возврата: {{ card.returnReason }}</p>
          <p>Последнее изменение: {{ card.lastModified }}</p>
          <button v-if="column.name !== 'Выполненные задачи'" @click="moveCard(cardIndex)">Переместить в следующий столбец</button>
          <button v-if="column.name === 'Тестирование'" @click="returnCard(cardIndex)">Переместить в предыдущий столбец</button>
          <button v-if="column.name !== 'Выполненные задачи'" @click="editCard(cardIndex)">Редактировать</button>
        </div>
        <div class="add-card" v-if="isFirstColumn">
          <label for="newCardTitle">Название карточки:</label>
          <input id="newCardTitle" v-model="newCardTitle" placeholder="Название карточки" />
  
          <label for="newCardDescription">Описание:</label>
          <input id="newCardDescription" v-model="newCardDescription" placeholder="Описание" />
  
          <label for="newCardDeadline">Дэдлайн до:</label>
          <input id="newCardDeadline" type="date" v-model="newCardDeadline" placeholder="Дэдлайн до:" />
  
          <button @click="addCard">Add Card</button>
        </div>
      </div>
    `,
    data() {
      return {
        newCardTitle: '',
        newCardDescription: '',
        newCardDeadline: '',
        lastModified: ''
      };
    },
    methods: {
      addCard() {
        if (
          this.newCardTitle.trim() !== '' &&
          this.newCardDescription.trim() !== '' &&
          this.newCardDeadline.trim() !== ''
        ) {
        const currentDate = new Date().toLocaleString();
        const cardData = {
            title: this.newCardTitle,
            created: currentDate,
            description: this.newCardDescription,
            deadline: this.newCardDeadline,
            returnReason: '',
            returned: false,
            completedOnTime: '',
            lastModified: currentDate, 
        };
          this.$emit('add-card', cardData);
          this.newCardTitle = '';
          this.newCardDescription = '';
          this.newCardDeadline = '';
        }
      },
      moveCard(cardIndex) {
        this.$emit('move-card', cardIndex);
        if (columnIndex + 1 === 2 || columnIndex + 1 === 3 || columnIndex + 1 === 4)  {
            card.lastModified = new Date().toLocaleString();
          }
      },
      returnCard(cardIndex) {
        this.$emit('return-card', cardIndex);
      },
      editCard(cardIndex) {
        const newTitle = prompt('Введите новое название карточки:');
        if (newTitle) {
          this.column.cards[cardIndex].title = newTitle;
        }
        this.column.cards[cardIndex].lastModified = new Date().toLocaleString();
        const newDescription = prompt('Введите новое описание карточки:');
        if (newDescription) {
          this.column.cards[cardIndex].description = newDescription;
        }
  
        this.column.cards[cardIndex].lastModified = new Date().toLocaleString();
      }
    }
  });
  
  new Vue({
    el: '#app',
    data() {
      return {
        columns: [
          {
            name: 'Запланированные задачи',
            cards: []
          },
          {
            name: 'Задачи в работе',
            cards: []
          },
          {
            name: 'Тестирование',
            cards: []
          },
          {
            name: 'Выполненные задачи',
            cards: []
          }
        ]
      };
    },
    methods: {
      addCard(columnIndex, cardData) {
        this.columns[columnIndex].cards.push(cardData);
        this.saveData();
      },
      moveCard(columnIndex, cardIndex) {
        if (columnIndex + 1 < this.columns.length) {
          const card = this.columns[columnIndex].cards.splice(cardIndex, 1)[0];
  
          if (columnIndex + 1 === 2) {
            card.lastModified = new Date().toLocaleString();
          }
  
          if (columnIndex + 1 === 3) {
            const currentDate = new Date();
            const deadlineDate = new Date(card.deadline);
            if (currentDate > deadlineDate) {
              card.completedOnTime = 'Пропущен срок';
            } else {
              card.completedOnTime = 'Выполнено в срок';
            }
          }
  
          this.columns[columnIndex + 1].cards.push(card);
          this.saveData();
        }
      },
      returnCard(columnIndex, cardIndex) {
        if (columnIndex - 1 >= 0) {
          const returnReason = prompt('Причина возврата:');
          const card = this.columns[columnIndex].cards.splice(cardIndex, 1)[0];
          card.returned = true;
          card.returnReason = returnReason;
          this.columns[columnIndex - 1].cards.push(card);
          this.saveData();
        }
      },
      saveData() {
        localStorage.setItem('kanbanData', JSON.stringify(this.columns));
      },
      loadData() {
        const data = localStorage.getItem('kanbanData');
        if (data) {
          this.columns = JSON.parse(data);
        }
      }
    },
    created() {
      this.loadData();
    }
  });