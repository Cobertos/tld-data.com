<template>
  <div>
    <div
      class="filter-controls">
      <input
        type="text"
        v-model="tldSearch">

      <div class="checkbox-box">
        <div>
          <label
            for="checkbox-for-brand">
            Brand?
          </label>
          <input
            id="checkbox-for-brand"
            type="checkbox"
            v-model="showBrandTLDs">
        </div>

        <div>
          <label
            for="checkbox-for-availability">
            Released?
          </label>
          <input
            id="checkbox-for-availability"
            type="checkbox"
            v-model="showOnlyAvailable">
        </div>

        <div class="checkbox-box-box">
          <div
            v-for="_, type in showType">
            <label
              :for="`checkbox-for-${type}`">
              {{type}}
            </label>
            <input
              :id="`checkbox-for-${type}`"
              type="checkbox"
              v-model="showType[type]">
          </div>
        </div>
      </div>
    </div>
    
    <div class="tld-list">
      <span
        class="tld"
        v-for="tld in filteredTLDs"
        v-html="`.${tld}`">
      </span>
    </div>
    <p>Powered by <a href="https://github.com/Cobertos/tld-data/">tld-data @ GitHub</a></p>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';
import tldData from '@/deps/tld-data/tldData.json';
Array.prototype.unique = function() {
  return Array.from(new Set(this));
};
const tldTypes = tldData
  .map(o => o.type)
  .unique();


console.log(tldData);
export default {
  data() {
    return {
      tldSearch: '',
      showBrandTLDs: false,
      showOnlyAvailable: true,
      showType: tldTypes
        .map(type => ({ [type]: true }))
        .reduce((acc, itm) => ({ ...acc, ...itm }), {})
    };
  },
  computed: {
    tldTypes() {
      return tldData
        .map(o => o.type)
        .unique();
    },
    filteredTLDs() {
      let filtered = tldData;
      if(!this.showBrandTLDs) {
        filtered = filtered
          .filter(o => !o.isBrand);
      }
      if(this.showOnlyAvailable) {
        filtered = filtered
          .filter(o => o.isInGeneralAvailability || o.isInGeneralAvailability === undefined);
      }
      else {
        filtered = filtered
          .filter(o => !o.isInGeneralAvailability);
      }

      filtered = filtered
        .filter(o => this.showType[o.type]);
      const filteredStrs = filtered
        .map(o => o.tld);
      if(this.tldSearch !== '') {
        return fuzzy.filter(this.tldSearch, filteredStrs, {
          pre: '<span class="tld-fuzzy-match">',
          post: '</span>'
        })
        .map(o => o.string);
      }
      else {
        return filteredStrs
      }
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_func.scss';

.filter-controls {
  width: 100%;
  margin: 20px;
  @include desktop {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}

.checkbox-box {
  display: inline-block;
  border: 1px solid #444;
  background-color: #222;
  padding: 10px;

  .checkbox-box-box {
    border: 1px solid #999;
    background-color: #444;
    padding: 10px;
  }
}

.tld-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px;

  .tld {
    border: 1px solid #222;
    padding: 2px;
    margin: 5px;

    .tld-fuzzy-match {
      color: $accent-color;
    }
  }
}
</style>