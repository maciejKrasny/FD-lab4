import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';

import './main.html';
import { Players } from '../lib/collections';

Tracker.autorun(() => {
  const players = [];

  Players.find({}).forEach((player) => {
    players.push(player);
  });

  players.sort((x, y) => {
    if (x.likes - x.dislikes > y.likes - y.dislikes) {
      return -1;
    } else if (x.likes - x.dislikes < y.likes - y.dislikes) {
      return 1;
    } else return 0;
  });

  if (Session.get('sortDesc')) {
    players.reverse();
  }

  Session.set('players', players);
})

Template.body.helpers({
  players() {
    return Session.get('players');
  },
  sortArrow() {
    if (Session.get('sortDesc')) {
      return 'arrow_downward';
    }
    return 'arrow_upward';
  }
});

Template.body.events({
  'click #openModal': function() {
    event.preventDefault();
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    return false;
  },
  'click': function() {
    var modal = document.getElementById("myModal");
      if (event.target == modal) {
        modal.style.display = "none";
      }
  },
  'click #sort': function() {
    Session.set('sortDesc', !Session.get('sortDesc'));
  }
})

Template.add.events({
  'click .close': function() {
    event.preventDefault();
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    return false;
  },
  'submit .add-form': function() {
    event.preventDefault();
    
    const name = event.target.name.value;
    const image = event.target.image.value;

    Players.insert({
      name,
      image,
      likes: 0,
      dislikes: 0,
    });

    event.target.name.value = '';
    event.target.image.value = '';

    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    return false;
  }
});

Template.player.events({
  'click #like': function() {
    Players.update(this._id, {$set: {likes: this.likes + 1}});
    return false;
  },
  'click #dislike': function() {
    Players.update(this._id, {$set: {dislikes: this.dislikes + 1}});
    return false;
  },
  'click .delete-note': function() {
    Players.remove(this._id);
    return false;
  }
});

Template.registerHelper('incremented', function (index) {
  if (Session.get('sortDesc')) {
    return Array.from(Session.get('players')).length - index;
  }
  return ++index;
});

