package com.fiche.patient.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fiche.patient.IntegrationTest;
import com.fiche.patient.domain.Statistique;
import com.fiche.patient.repository.StatistiqueRepository;
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
 * Integration tests for the {@link StatistiqueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StatistiqueResourceIT {

    private static final String ENTITY_API_URL = "/api/statistiques";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StatistiqueRepository statistiqueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStatistiqueMockMvc;

    private Statistique statistique;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Statistique createEntity(EntityManager em) {
        Statistique statistique = new Statistique();
        return statistique;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Statistique createUpdatedEntity(EntityManager em) {
        Statistique statistique = new Statistique();
        return statistique;
    }

    @BeforeEach
    public void initTest() {
        statistique = createEntity(em);
    }

    @Test
    @Transactional
    void createStatistique() throws Exception {
        int databaseSizeBeforeCreate = statistiqueRepository.findAll().size();
        // Create the Statistique
        restStatistiqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(statistique)))
            .andExpect(status().isCreated());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeCreate + 1);
        Statistique testStatistique = statistiqueList.get(statistiqueList.size() - 1);
    }

    @Test
    @Transactional
    void createStatistiqueWithExistingId() throws Exception {
        // Create the Statistique with an existing ID
        statistique.setId(1L);

        int databaseSizeBeforeCreate = statistiqueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStatistiqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(statistique)))
            .andExpect(status().isBadRequest());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStatistiques() throws Exception {
        // Initialize the database
        statistiqueRepository.saveAndFlush(statistique);

        // Get all the statistiqueList
        restStatistiqueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(statistique.getId().intValue())));
    }

    @Test
    @Transactional
    void getStatistique() throws Exception {
        // Initialize the database
        statistiqueRepository.saveAndFlush(statistique);

        // Get the statistique
        restStatistiqueMockMvc
            .perform(get(ENTITY_API_URL_ID, statistique.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(statistique.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingStatistique() throws Exception {
        // Get the statistique
        restStatistiqueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStatistique() throws Exception {
        // Initialize the database
        statistiqueRepository.saveAndFlush(statistique);

        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();

        // Update the statistique
        Statistique updatedStatistique = statistiqueRepository.findById(statistique.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStatistique are not directly saved in db
        em.detach(updatedStatistique);

        restStatistiqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStatistique.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStatistique))
            )
            .andExpect(status().isOk());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
        Statistique testStatistique = statistiqueList.get(statistiqueList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingStatistique() throws Exception {
        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();
        statistique.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStatistiqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, statistique.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(statistique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStatistique() throws Exception {
        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();
        statistique.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatistiqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(statistique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStatistique() throws Exception {
        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();
        statistique.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatistiqueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(statistique)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStatistiqueWithPatch() throws Exception {
        // Initialize the database
        statistiqueRepository.saveAndFlush(statistique);

        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();

        // Update the statistique using partial update
        Statistique partialUpdatedStatistique = new Statistique();
        partialUpdatedStatistique.setId(statistique.getId());

        restStatistiqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStatistique.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStatistique))
            )
            .andExpect(status().isOk());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
        Statistique testStatistique = statistiqueList.get(statistiqueList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateStatistiqueWithPatch() throws Exception {
        // Initialize the database
        statistiqueRepository.saveAndFlush(statistique);

        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();

        // Update the statistique using partial update
        Statistique partialUpdatedStatistique = new Statistique();
        partialUpdatedStatistique.setId(statistique.getId());

        restStatistiqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStatistique.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStatistique))
            )
            .andExpect(status().isOk());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
        Statistique testStatistique = statistiqueList.get(statistiqueList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingStatistique() throws Exception {
        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();
        statistique.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStatistiqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, statistique.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(statistique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStatistique() throws Exception {
        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();
        statistique.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatistiqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(statistique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStatistique() throws Exception {
        int databaseSizeBeforeUpdate = statistiqueRepository.findAll().size();
        statistique.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatistiqueMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(statistique))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Statistique in the database
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStatistique() throws Exception {
        // Initialize the database
        statistiqueRepository.saveAndFlush(statistique);

        int databaseSizeBeforeDelete = statistiqueRepository.findAll().size();

        // Delete the statistique
        restStatistiqueMockMvc
            .perform(delete(ENTITY_API_URL_ID, statistique.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Statistique> statistiqueList = statistiqueRepository.findAll();
        assertThat(statistiqueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
