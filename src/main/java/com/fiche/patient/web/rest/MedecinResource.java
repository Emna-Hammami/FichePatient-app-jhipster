package com.fiche.patient.web.rest;

import com.fiche.patient.domain.Medecin;
import com.fiche.patient.repository.MedecinRepository;
import com.fiche.patient.repository.ServiceRepository;
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
 * REST controller for managing {@link com.fiche.patient.domain.Medecin}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MedecinResource {

    private final Logger log = LoggerFactory.getLogger(MedecinResource.class);

    private static final String ENTITY_NAME = "medecin";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MedecinRepository medecinRepository;

    private final ServiceRepository serviceRepository;

    public MedecinResource(MedecinRepository medecinRepository, ServiceRepository serviceRepository) {
        this.medecinRepository = medecinRepository;
        this.serviceRepository = serviceRepository;
    }

    /**
     * {@code POST  /medecins} : Create a new medecin.
     *
     * @param medecin the medecin to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new medecin, or with status {@code 400 (Bad Request)} if the medecin has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/medecins")
    public ResponseEntity<Medecin> createMedecin(@Valid @RequestBody Medecin medecin) throws URISyntaxException {
        log.debug("REST request to save Medecin : {}", medecin);
        if (medecin.getId() != null) {
            throw new BadRequestAlertException("A new medecin cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (Objects.isNull(medecin.getService())) {
            throw new BadRequestAlertException("Invalid association value provided", ENTITY_NAME, "null");
        }
        Long serviceId = medecin.getService().getId();
        serviceRepository.findById(serviceId).ifPresent(medecin::service);
        Medecin result = medecinRepository.save(medecin);
        return ResponseEntity
            .created(new URI("/api/medecins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /medecins/:id} : Updates an existing medecin.
     *
     * @param id the id of the medecin to save.
     * @param medecin the medecin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medecin,
     * or with status {@code 400 (Bad Request)} if the medecin is not valid,
     * or with status {@code 500 (Internal Server Error)} if the medecin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/medecins/{id}")
    public ResponseEntity<Medecin> updateMedecin(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Medecin medecin
    ) throws URISyntaxException {
        log.debug("REST request to update Medecin : {}, {}", id, medecin);
        if (medecin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medecin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medecinRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Medecin result = medecinRepository.save(medecin);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, medecin.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /medecins/:id} : Partial updates given fields of an existing medecin, field will ignore if it is null
     *
     * @param id the id of the medecin to save.
     * @param medecin the medecin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medecin,
     * or with status {@code 400 (Bad Request)} if the medecin is not valid,
     * or with status {@code 404 (Not Found)} if the medecin is not found,
     * or with status {@code 500 (Internal Server Error)} if the medecin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/medecins/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Medecin> partialUpdateMedecin(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Medecin medecin
    ) throws URISyntaxException {
        log.debug("REST request to partial update Medecin partially : {}, {}", id, medecin);
        if (medecin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medecin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medecinRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Medecin> result = medecinRepository
            .findById(medecin.getId())
            .map(existingMedecin -> {
                if (medecin.getNomMed() != null) {
                    existingMedecin.setNomMed(medecin.getNomMed());
                }
                if (medecin.getAdresse() != null) {
                    existingMedecin.setAdresse(medecin.getAdresse());
                }
                if (medecin.getTel() != null) {
                    existingMedecin.setTel(medecin.getTel());
                }
                if (medecin.getFax() != null) {
                    existingMedecin.setFax(medecin.getFax());
                }
                if (medecin.getEmail() != null) {
                    existingMedecin.setEmail(medecin.getEmail());
                }
                if (medecin.getUrl() != null) {
                    existingMedecin.setUrl(medecin.getUrl());
                }

                return existingMedecin;
            })
            .map(medecinRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, medecin.getId().toString())
        );
    }

    /**
     * {@code GET  /medecins} : get all the medecins.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of medecins in body.
     */
    @GetMapping("/medecins")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Medecin>> getAllMedecins(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Medecins");
        Page<Medecin> page;
        if (eagerload) {
            page = medecinRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = medecinRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /medecins/:id} : get the "id" medecin.
     *
     * @param id the id of the medecin to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the medecin, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/medecins/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Medecin> getMedecin(@PathVariable Long id) {
        log.debug("REST request to get Medecin : {}", id);
        Optional<Medecin> medecin = medecinRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(medecin);
    }

    /**
     * {@code DELETE  /medecins/:id} : delete the "id" medecin.
     *
     * @param id the id of the medecin to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/medecins/{id}")
    public ResponseEntity<Void> deleteMedecin(@PathVariable Long id) {
        log.debug("REST request to delete Medecin : {}", id);
        medecinRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
