package com.fiche.patient.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fiche.patient.IntegrationTest;
import com.fiche.patient.domain.FicheP;
import com.fiche.patient.repository.FichePRepository;
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
 * Integration tests for the {@link FichePResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FichePResourceIT {

    private static final Integer DEFAULT_NUM_DOSSIER = 1;
    private static final Integer UPDATED_NUM_DOSSIER = 2;

    private static final String DEFAULT_NOM_PATIENT = "AAAAAAAAAA";
    private static final String UPDATED_NOM_PATIENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/fiche-ps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FichePRepository fichePRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFichePMockMvc;

    private FicheP ficheP;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FicheP createEntity(EntityManager em) {
        FicheP ficheP = new FicheP().numDossier(DEFAULT_NUM_DOSSIER).nomPatient(DEFAULT_NOM_PATIENT);
        return ficheP;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FicheP createUpdatedEntity(EntityManager em) {
        FicheP ficheP = new FicheP().numDossier(UPDATED_NUM_DOSSIER).nomPatient(UPDATED_NOM_PATIENT);
        return ficheP;
    }

    @BeforeEach
    public void initTest() {
        ficheP = createEntity(em);
    }

    @Test
    @Transactional
    void createFicheP() throws Exception {
        int databaseSizeBeforeCreate = fichePRepository.findAll().size();
        // Create the FicheP
        restFichePMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficheP)))
            .andExpect(status().isCreated());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeCreate + 1);
        FicheP testFicheP = fichePList.get(fichePList.size() - 1);
        assertThat(testFicheP.getNumDossier()).isEqualTo(DEFAULT_NUM_DOSSIER);
        assertThat(testFicheP.getNomPatient()).isEqualTo(DEFAULT_NOM_PATIENT);
    }

    @Test
    @Transactional
    void createFichePWithExistingId() throws Exception {
        // Create the FicheP with an existing ID
        ficheP.setId(1L);

        int databaseSizeBeforeCreate = fichePRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFichePMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficheP)))
            .andExpect(status().isBadRequest());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumDossierIsRequired() throws Exception {
        int databaseSizeBeforeTest = fichePRepository.findAll().size();
        // set the field null
        ficheP.setNumDossier(null);

        // Create the FicheP, which fails.

        restFichePMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficheP)))
            .andExpect(status().isBadRequest());

        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNomPatientIsRequired() throws Exception {
        int databaseSizeBeforeTest = fichePRepository.findAll().size();
        // set the field null
        ficheP.setNomPatient(null);

        // Create the FicheP, which fails.

        restFichePMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficheP)))
            .andExpect(status().isBadRequest());

        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFichePS() throws Exception {
        // Initialize the database
        fichePRepository.saveAndFlush(ficheP);

        // Get all the fichePList
        restFichePMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ficheP.getId().intValue())))
            .andExpect(jsonPath("$.[*].numDossier").value(hasItem(DEFAULT_NUM_DOSSIER)))
            .andExpect(jsonPath("$.[*].nomPatient").value(hasItem(DEFAULT_NOM_PATIENT)));
    }

    @Test
    @Transactional
    void getFicheP() throws Exception {
        // Initialize the database
        fichePRepository.saveAndFlush(ficheP);

        // Get the ficheP
        restFichePMockMvc
            .perform(get(ENTITY_API_URL_ID, ficheP.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ficheP.getId().intValue()))
            .andExpect(jsonPath("$.numDossier").value(DEFAULT_NUM_DOSSIER))
            .andExpect(jsonPath("$.nomPatient").value(DEFAULT_NOM_PATIENT));
    }

    @Test
    @Transactional
    void getNonExistingFicheP() throws Exception {
        // Get the ficheP
        restFichePMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFicheP() throws Exception {
        // Initialize the database
        fichePRepository.saveAndFlush(ficheP);

        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();

        // Update the ficheP
        FicheP updatedFicheP = fichePRepository.findById(ficheP.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFicheP are not directly saved in db
        em.detach(updatedFicheP);
        updatedFicheP.numDossier(UPDATED_NUM_DOSSIER).nomPatient(UPDATED_NOM_PATIENT);

        restFichePMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFicheP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFicheP))
            )
            .andExpect(status().isOk());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
        FicheP testFicheP = fichePList.get(fichePList.size() - 1);
        assertThat(testFicheP.getNumDossier()).isEqualTo(UPDATED_NUM_DOSSIER);
        assertThat(testFicheP.getNomPatient()).isEqualTo(UPDATED_NOM_PATIENT);
    }

    @Test
    @Transactional
    void putNonExistingFicheP() throws Exception {
        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();
        ficheP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFichePMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ficheP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ficheP))
            )
            .andExpect(status().isBadRequest());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFicheP() throws Exception {
        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();
        ficheP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichePMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ficheP))
            )
            .andExpect(status().isBadRequest());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFicheP() throws Exception {
        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();
        ficheP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichePMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficheP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFichePWithPatch() throws Exception {
        // Initialize the database
        fichePRepository.saveAndFlush(ficheP);

        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();

        // Update the ficheP using partial update
        FicheP partialUpdatedFicheP = new FicheP();
        partialUpdatedFicheP.setId(ficheP.getId());

        partialUpdatedFicheP.numDossier(UPDATED_NUM_DOSSIER).nomPatient(UPDATED_NOM_PATIENT);

        restFichePMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFicheP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFicheP))
            )
            .andExpect(status().isOk());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
        FicheP testFicheP = fichePList.get(fichePList.size() - 1);
        assertThat(testFicheP.getNumDossier()).isEqualTo(UPDATED_NUM_DOSSIER);
        assertThat(testFicheP.getNomPatient()).isEqualTo(UPDATED_NOM_PATIENT);
    }

    @Test
    @Transactional
    void fullUpdateFichePWithPatch() throws Exception {
        // Initialize the database
        fichePRepository.saveAndFlush(ficheP);

        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();

        // Update the ficheP using partial update
        FicheP partialUpdatedFicheP = new FicheP();
        partialUpdatedFicheP.setId(ficheP.getId());

        partialUpdatedFicheP.numDossier(UPDATED_NUM_DOSSIER).nomPatient(UPDATED_NOM_PATIENT);

        restFichePMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFicheP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFicheP))
            )
            .andExpect(status().isOk());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
        FicheP testFicheP = fichePList.get(fichePList.size() - 1);
        assertThat(testFicheP.getNumDossier()).isEqualTo(UPDATED_NUM_DOSSIER);
        assertThat(testFicheP.getNomPatient()).isEqualTo(UPDATED_NOM_PATIENT);
    }

    @Test
    @Transactional
    void patchNonExistingFicheP() throws Exception {
        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();
        ficheP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFichePMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ficheP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ficheP))
            )
            .andExpect(status().isBadRequest());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFicheP() throws Exception {
        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();
        ficheP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichePMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ficheP))
            )
            .andExpect(status().isBadRequest());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFicheP() throws Exception {
        int databaseSizeBeforeUpdate = fichePRepository.findAll().size();
        ficheP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichePMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ficheP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FicheP in the database
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFicheP() throws Exception {
        // Initialize the database
        fichePRepository.saveAndFlush(ficheP);

        int databaseSizeBeforeDelete = fichePRepository.findAll().size();

        // Delete the ficheP
        restFichePMockMvc
            .perform(delete(ENTITY_API_URL_ID, ficheP.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FicheP> fichePList = fichePRepository.findAll();
        assertThat(fichePList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
