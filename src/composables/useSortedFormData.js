import { ref } from 'vue';

import asetName from '../services/asetName.service';
import campaign from '../services/campaign.service';
import career from '../services/career.service';
import channel from '../services/channel.service';
import cycle from '../services/cycle.service';
import followUp from '../services/followUp.service';
import grade from '../services/grade.service';
import list from '../services/list.service';
import promotion from '../services/promotion.service';

import countryService from '../services/country.service';
import stateService from '../services/state.service';
import cityService from '../services/city.service';

const sortBy = (prop) => (a, b) => (a[prop] || '').localeCompare(b[prop] || '');

export function useSortedFormData() {
  const followUps = ref([]);
  const grades = ref([]);
  const asetNames = ref([]);
  const campaigns = ref([]);
  const cycles = ref([]);
  const lists = ref([]);
  const channels = ref([]);
  const careers = ref([]);
  const promotions = ref([]);

  const countries = ref([]);
  const states = ref([]);
  const cities = ref([]);

  const loadSortedData = async () => {
    followUps.value = (await followUp.getAll()).data.data.sort(sortBy('name'));

    grades.value = (await grade.getAll()).data.data.sort(sortBy('name'));

    asetNames.value = (await asetName.getAll()).data.data.sort((a, b) => {
      const aFull = `${a.contactType.name} - ${a.name}`;
      const bFull = `${b.contactType.name} - ${b.name}`;
      return aFull.localeCompare(bFull);
    });

    campaigns.value = (await campaign.getAll()).data.data.sort(sortBy('name'));
    cycles.value = (await cycle.getAll()).data.data.sort(sortBy('cycle'));
    lists.value = (await list.getAll()).data.data.sort(sortBy('noLista'));
    channels.value = (await channel.getAll()).data.data.sort(sortBy('name'));
    careers.value = (await career.getAll()).data.data.sort(sortBy('program'));
    promotions.value = (await promotion.getAll()).data.data.sort(sortBy('name'));

    countries.value = (await countryService.getAll()).data.data.sort(sortBy('name'));
    states.value = (await stateService.getAll()).data.data.sort(sortBy('name'));
    cities.value = (await cityService.getAll()).data.data.sort(sortBy('name'));
  };

  return {
    followUps,
    grades,
    asetNames,
    campaigns,
    cycles,
    lists,
    channels,
    careers,
    promotions,
    countries,
    states,
    cities,
    loadSortedData,
  };
}
