<script setup>
import { ref, computed } from 'vue'
import Socket from '@/utils/socket.js'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import useNotification from '@/hooks/useNotification.js'
import OponentAbandoned from '@/components/Modal/OponentAbandoned.vue'
import PlayerId from '@/utils/playerId'
import Layout from '@/layout/Index.vue'
import NameInput from '@/components/NameInput.vue'

const router = useRouter()
const notification = useNotification()

const playerName = ref(null)
const matchId = ref(null)

const playerId = PlayerId.get()

const showOponentAbandoned = computed(() => {
  return Boolean(router.currentRoute.value.query.oponentAbandoned)
})

Socket.connect()

function convertToUpperCase(e) {
  matchId.value = e.target.value.toUpperCase()
}

async function createMatch(e) {
  e.preventDefault()
  try {
    const response = await Socket.instance
      .timeout(2_000)
      .emitWithAck('match:create', playerName.value)

    if (response.playerId) {
      console.log('Received new player Id:', response.playerId)
      PlayerId.set(response.playerId)
    }

    if (response.matchId) {
      router.push(`/online/${response.matchId}`)
    }

    if (response.error) {
      alert(response.error)
    }
  } catch (e) {
    notification.error({
      summary: e
    })
  }
}

async function joinMatch(e) {
  e.preventDefault()
  const response = await Socket.instance
    .timeout(2_000)
    .emitWithAck('match:join', matchId.value, playerName.value, playerId)

  if (response.error) {
    alert(response.error)
    return
  }

  if (response.playerId) {
    console.log('Received new playerId:', response.playerId)
    PlayerId.set(response.playerId)
  }

  router.push(`/online/${matchId.value}`)
}

function handleOponentAbandonedClose() {
  router.replace('/online')
}
</script>

<template>
  <Layout>
    <TabView class="tab-view">
      <TabPanel header="Create Match">
        <form :onsubmit="createMatch">
          <NameInput v-model="playerName" />

          <Button :disabled="!playerName" label="Create" type="submit" />
        </form>
      </TabPanel>

      <!-- -------------------------------------- -->

      <TabPanel header="Join Match">
        <form :onsubmit="joinMatch">
          <NameInput v-model="playerName" />

          <FloatLabel>
            <InputText
              id="matchId"
              type="text"
              autocomplete="off"
              v-model="matchId"
              @input="convertToUpperCase"
            />
            <label for="matchId">Match ID</label>
          </FloatLabel>

          <Button :disabled="!playerName || !matchId" label="Join" type="submit" />
        </form>
      </TabPanel>
    </TabView>

    <OponentAbandoned :visible="showOponentAbandoned" @close="handleOponentAbandonedClose" />
  </Layout>
</template>

<style>
.tab-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.p-tabview-panels {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.p-tabview-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.p-tabview-panel .p-float-label,
.p-tabview-panel button {
  margin-top: 2rem;
}
</style>
