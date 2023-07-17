package com.fiche.patient.web.rest;

import com.fiche.patient.domain.FicheP;
import com.fiche.patient.repository.FichePRepository;
import com.fiche.patient.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.fiche.patient.domain.FicheP}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FichePResource {

    private final Logger log = LoggerFactory.getLogger(FichePResource.class);

    private static final String ENTITY_NAME = "ficheP";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FichePRepository fichePRepository;

    public FichePResource(FichePRepository fichePRepository) {
        this.fichePRepository = fichePRepository;
    }

    /**
     * {@code POST  /fiche-ps} : Create a new ficheP.
     *
     * @param ficheP the ficheP to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ficheP, or with status {@code 400 (Bad Request)} if the ficheP has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fiche-ps")
    public ResponseEntity<FicheP> createFicheP(@Valid @RequestBody FicheP ficheP) throws URISyntaxException {
        log.debug("REST request to save FicheP : {}", ficheP);
        if (ficheP.getId() != null) {
            throw new BadRequestAlertException("A new ficheP cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FicheP result = fichePRepository.save(ficheP);
        return ResponseEntity
            .created(new URI("/api/fiche-ps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fiche-ps/:id} : Updates an existing ficheP.
     *
     * @param id the id of the ficheP to save.
     * @param ficheP the ficheP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ficheP,
     * or with status {@code 400 (Bad Request)} if the ficheP is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ficheP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fiche-ps/{id}")
    public ResponseEntity<FicheP> updateFicheP(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FicheP ficheP
    ) throws URISyntaxException {
        log.debug("REST request to update FicheP : {}, {}", id, ficheP);
        if (ficheP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ficheP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fichePRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FicheP result = fichePRepository.save(ficheP);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, ficheP.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fiche-ps/:id} : Partial updates given fields of an existing ficheP, field will ignore if it is null
     *
     * @param id the id of the ficheP to save.
     * @param ficheP the ficheP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ficheP,
     * or with status {@code 400 (Bad Request)} if the ficheP is not valid,
     * or with status {@code 404 (Not Found)} if the ficheP is not found,
     * or with status {@code 500 (Internal Server Error)} if the ficheP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fiche-ps/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FicheP> partialUpdateFicheP(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FicheP ficheP
    ) throws URISyntaxException {
        log.debug("REST request to partial update FicheP partially : {}, {}", id, ficheP);
        if (ficheP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ficheP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fichePRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FicheP> result = fichePRepository
            .findById(ficheP.getId())
            .map(existingFicheP -> {
                if (ficheP.getNumDossier() != null) {
                    existingFicheP.setNumDossier(ficheP.getNumDossier());
                }
                if (ficheP.getNomPatient() != null) {
                    existingFicheP.setNomPatient(ficheP.getNomPatient());
                }

                return existingFicheP;
            })
            .map(fichePRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, ficheP.getId().toString())
        );
    }

    /**
     * {@code GET  /fiche-ps} : get all the fichePS.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fichePS in body.
     */
    @GetMapping("/fiche-ps")
    public ResponseEntity<List<FicheP>> getAllFichePS(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of FichePS");
        Page<FicheP> page = fichePRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fiche-ps/:id} : get the "id" ficheP.
     *
     * @param id the id of the ficheP to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ficheP, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fiche-ps/{id}")
    public ResponseEntity<FicheP> getFicheP(@PathVariable Long id) {
        log.debug("REST request to get FicheP : {}", id);
        Optional<FicheP> ficheP = fichePRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ficheP);
    }

    /**
     * {@code DELETE  /fiche-ps/:id} : delete the "id" ficheP.
     *
     * @param id the id of the ficheP to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fiche-ps/{id}")
    public ResponseEntity<Void> deleteFicheP(@PathVariable Long id) {
        log.debug("REST request to delete FicheP : {}", id);
        fichePRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
