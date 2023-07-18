package com.fiche.patient.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fiche.patient.IntegrationTest;
import com.fiche.patient.domain.Fiche;
import com.fiche.patient.repository.FicheRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FicheResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FicheResourceIT {

    private static final String ENTITY_API_URL = "/api/fiches";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FicheRepository ficheRepository;

    @Mock
    private FicheRepository ficheRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFicheMockMvc;

    private Fiche fiche;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fiche createEntity(EntityManager em) {
        Fiche fiche = new Fiche();
        return fiche;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fiche createUpdatedEntity(EntityManager em) {
        Fiche fiche = new Fiche();
        return fiche;
    }

    @BeforeEach
    public void initTest() {
        fiche = createEntity(em);
    }

    @Test
    @Transactional
    void createFiche() throws Exception {
        int databaseSizeBeforeCreate = ficheRepository.findAll().size();
        // Create the Fiche
        restFicheMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fiche)))
            .andExpect(status().isCreated());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeCreate + 1);
        Fiche testFiche = ficheList.get(ficheList.size() - 1);
    }

    @Test
    @Transactional
    void createFicheWithExistingId() throws Exception {
        // Create the Fiche with an existing ID
        fiche.setId(1L);

        int databaseSizeBeforeCreate = ficheRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFicheMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fiche)))
            .andExpect(status().isBadRequest());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFiches() throws Exception {
        // Initialize the database
        ficheRepository.saveAndFlush(fiche);

        // Get all the ficheList
        restFicheMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fiche.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFichesWithEagerRelationshipsIsEnabled() throws Exception {
        when(ficheRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFicheMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ficheRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFichesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(ficheRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFicheMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(ficheRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getFiche() throws Exception {
        // Initialize the database
        ficheRepository.saveAndFlush(fiche);

        // Get the fiche
        restFicheMockMvc
            .perform(get(ENTITY_API_URL_ID, fiche.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fiche.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingFiche() throws Exception {
        // Get the fiche
        restFicheMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFiche() throws Exception {
        // Initialize the database
        ficheRepository.saveAndFlush(fiche);

        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();

        // Update the fiche
        Fiche updatedFiche = ficheRepository.findById(fiche.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFiche are not directly saved in db
        em.detach(updatedFiche);

        restFicheMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFiche.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFiche))
            )
            .andExpect(status().isOk());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
        Fiche testFiche = ficheList.get(ficheList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingFiche() throws Exception {
        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();
        fiche.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFicheMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fiche.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fiche))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFiche() throws Exception {
        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();
        fiche.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicheMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fiche))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFiche() throws Exception {
        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();
        fiche.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicheMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fiche)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFicheWithPatch() throws Exception {
        // Initialize the database
        ficheRepository.saveAndFlush(fiche);

        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();

        // Update the fiche using partial update
        Fiche partialUpdatedFiche = new Fiche();
        partialUpdatedFiche.setId(fiche.getId());

        restFicheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFiche.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFiche))
            )
            .andExpect(status().isOk());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
        Fiche testFiche = ficheList.get(ficheList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateFicheWithPatch() throws Exception {
        // Initialize the database
        ficheRepository.saveAndFlush(fiche);

        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();

        // Update the fiche using partial update
        Fiche partialUpdatedFiche = new Fiche();
        partialUpdatedFiche.setId(fiche.getId());

        restFicheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFiche.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFiche))
            )
            .andExpect(status().isOk());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
        Fiche testFiche = ficheList.get(ficheList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingFiche() throws Exception {
        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();
        fiche.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFicheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fiche.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fiche))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFiche() throws Exception {
        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();
        fiche.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicheMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fiche))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFiche() throws Exception {
        int databaseSizeBeforeUpdate = ficheRepository.findAll().size();
        fiche.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicheMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fiche)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fiche in the database
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFiche() throws Exception {
        // Initialize the database
        ficheRepository.saveAndFlush(fiche);

        int databaseSizeBeforeDelete = ficheRepository.findAll().size();

        // Delete the fiche
        restFicheMockMvc
            .perform(delete(ENTITY_API_URL_ID, fiche.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Fiche> ficheList = ficheRepository.findAll();
        assertThat(ficheList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
