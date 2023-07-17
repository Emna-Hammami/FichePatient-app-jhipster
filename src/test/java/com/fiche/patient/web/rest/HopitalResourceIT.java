package com.fiche.patient.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fiche.patient.IntegrationTest;
import com.fiche.patient.domain.Hopital;
import com.fiche.patient.repository.HopitalRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HopitalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HopitalResourceIT {

    private static final String DEFAULT_NOM_HOP = "AAAAAAAAAA";
    private static final String UPDATED_NOM_HOP = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/hopitals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHopitalMockMvc;

    private Hopital hopital;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hopital createEntity(EntityManager em) {
        Hopital hopital = new Hopital().nomHop(DEFAULT_NOM_HOP);
        return hopital;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hopital createUpdatedEntity(EntityManager em) {
        Hopital hopital = new Hopital().nomHop(UPDATED_NOM_HOP);
        return hopital;
    }

    @BeforeEach
    public void initTest() {
        hopital = createEntity(em);
    }

    @Test
    @Transactional
    void createHopital() throws Exception {
        int databaseSizeBeforeCreate = hopitalRepository.findAll().size();
        // Create the Hopital
        restHopitalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hopital)))
            .andExpect(status().isCreated());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeCreate + 1);
        Hopital testHopital = hopitalList.get(hopitalList.size() - 1);
        assertThat(testHopital.getNomHop()).isEqualTo(DEFAULT_NOM_HOP);
    }

    @Test
    @Transactional
    void createHopitalWithExistingId() throws Exception {
        // Create the Hopital with an existing ID
        hopital.setId(1L);

        int databaseSizeBeforeCreate = hopitalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHopitalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hopital)))
            .andExpect(status().isBadRequest());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomHopIsRequired() throws Exception {
        int databaseSizeBeforeTest = hopitalRepository.findAll().size();
        // set the field null
        hopital.setNomHop(null);

        // Create the Hopital, which fails.

        restHopitalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hopital)))
            .andExpect(status().isBadRequest());

        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHopitals() throws Exception {
        // Initialize the database
        hopitalRepository.saveAndFlush(hopital);

        // Get all the hopitalList
        restHopitalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(hopital.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomHop").value(hasItem(DEFAULT_NOM_HOP)));
    }

    @Test
    @Transactional
    void getHopital() throws Exception {
        // Initialize the database
        hopitalRepository.saveAndFlush(hopital);

        // Get the hopital
        restHopitalMockMvc
            .perform(get(ENTITY_API_URL_ID, hopital.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(hopital.getId().intValue()))
            .andExpect(jsonPath("$.nomHop").value(DEFAULT_NOM_HOP));
    }

    @Test
    @Transactional
    void getNonExistingHopital() throws Exception {
        // Get the hopital
        restHopitalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHopital() throws Exception {
        // Initialize the database
        hopitalRepository.saveAndFlush(hopital);

        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();

        // Update the hopital
        Hopital updatedHopital = hopitalRepository.findById(hopital.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedHopital are not directly saved in db
        em.detach(updatedHopital);
        updatedHopital.nomHop(UPDATED_NOM_HOP);

        restHopitalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHopital.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHopital))
            )
            .andExpect(status().isOk());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
        Hopital testHopital = hopitalList.get(hopitalList.size() - 1);
        assertThat(testHopital.getNomHop()).isEqualTo(UPDATED_NOM_HOP);
    }

    @Test
    @Transactional
    void putNonExistingHopital() throws Exception {
        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();
        hopital.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHopitalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, hopital.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(hopital))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHopital() throws Exception {
        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();
        hopital.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHopitalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(hopital))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHopital() throws Exception {
        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();
        hopital.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHopitalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hopital)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHopitalWithPatch() throws Exception {
        // Initialize the database
        hopitalRepository.saveAndFlush(hopital);

        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();

        // Update the hopital using partial update
        Hopital partialUpdatedHopital = new Hopital();
        partialUpdatedHopital.setId(hopital.getId());

        restHopitalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHopital.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHopital))
            )
            .andExpect(status().isOk());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
        Hopital testHopital = hopitalList.get(hopitalList.size() - 1);
        assertThat(testHopital.getNomHop()).isEqualTo(DEFAULT_NOM_HOP);
    }

    @Test
    @Transactional
    void fullUpdateHopitalWithPatch() throws Exception {
        // Initialize the database
        hopitalRepository.saveAndFlush(hopital);

        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();

        // Update the hopital using partial update
        Hopital partialUpdatedHopital = new Hopital();
        partialUpdatedHopital.setId(hopital.getId());

        partialUpdatedHopital.nomHop(UPDATED_NOM_HOP);

        restHopitalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHopital.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHopital))
            )
            .andExpect(status().isOk());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
        Hopital testHopital = hopitalList.get(hopitalList.size() - 1);
        assertThat(testHopital.getNomHop()).isEqualTo(UPDATED_NOM_HOP);
    }

    @Test
    @Transactional
    void patchNonExistingHopital() throws Exception {
        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();
        hopital.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHopitalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, hopital.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hopital))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHopital() throws Exception {
        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();
        hopital.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHopitalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hopital))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHopital() throws Exception {
        int databaseSizeBeforeUpdate = hopitalRepository.findAll().size();
        hopital.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHopitalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(hopital)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hopital in the database
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHopital() throws Exception {
        // Initialize the database
        hopitalRepository.saveAndFlush(hopital);

        int databaseSizeBeforeDelete = hopitalRepository.findAll().size();

        // Delete the hopital
        restHopitalMockMvc
            .perform(delete(ENTITY_API_URL_ID, hopital.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Hopital> hopitalList = hopitalRepository.findAll();
        assertThat(hopitalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
