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
        lastModified:''
      };
    },
    methods: {
      addCard() {
        if (
          this.newCardTitle.trim() !== '' &&
          this.newCardDescription.trim() !== '' &&
          this.newCardDeadline.trim() !== ''
        ) {
          const currentDate = new Date().toLocaleDateString();
          this.$emit('add-card', {
            title: this.newCardTitle,
            created: currentDate,
            description: this.newCardDescription,
            deadline: this.newCardDeadline,
            completedOnTime: ''
          });
          this.newCardTitle = '';
          this.newCardDescription = '';
          this.newCardDeadline = '';
        }
      },
      moveCard(cardIndex) {
        this.$emit('move-card', cardIndex);
      },
    }
  });
  
  new Vue({
    el: '#app',
    data() {
      return {
        columns: [
          {
            name: 'Запланированные задачи',
            cards: [],
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
      },
      moveCard(columnIndex, cardIndex) {
        if (columnIndex + 1 < this.columns.length) {
          const card = this.columns[columnIndex].cards.splice(cardIndex, 1)[0];

          this.columns[columnIndex + 1].cards.push(card);
        }
      },
    }
  });
  