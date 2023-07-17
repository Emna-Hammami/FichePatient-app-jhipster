package com.fiche.patient.web.rest;

import com.fiche.patient.domain.Hopital;
import com.fiche.patient.repository.HopitalRepository;
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
 * REST controller for managing {@link com.fiche.patient.domain.Hopital}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HopitalResource {

    private final Logger log = LoggerFactory.getLogger(HopitalResource.class);

    private static final String ENTITY_NAME = "hopital";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HopitalRepository hopitalRepository;

    public HopitalResource(HopitalRepository hopitalRepository) {
        this.hopitalRepository = hopitalRepository;
    }

    /**
     * {@code POST  /hopitals} : Create a new hopital.
     *
     * @param hopital the hopital to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new hopital, or with status {@code 400 (Bad Request)} if the hopital has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hopitals")
    public ResponseEntity<Hopital> createHopital(@Valid @RequestBody Hopital hopital) throws URISyntaxException {
        log.debug("REST request to save Hopital : {}", hopital);
        if (hopital.getId() != null) {
            throw new BadRequestAlertException("A new hopital cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Hopital result = hopitalRepository.save(hopital);
        return ResponseEntity
            .created(new URI("/api/hopitals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /hopitals/:id} : Updates an existing hopital.
     *
     * @param id the id of the hopital to save.
     * @param hopital the hopital to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hopital,
     * or with status {@code 400 (Bad Request)} if the hopital is not valid,
     * or with status {@code 500 (Internal Server Error)} if the hopital couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hopitals/{id}")
    public ResponseEntity<Hopital> updateHopital(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Hopital hopital
    ) throws URISyntaxException {
        log.debug("REST request to update Hopital : {}, {}", id, hopital);
        if (hopital.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hopital.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hopitalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Hopital result = hopitalRepository.save(hopital);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, hopital.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /hopitals/:id} : Partial updates given fields of an existing hopital, field will ignore if it is null
     *
     * @param id the id of the hopital to save.
     * @param hopital the hopital to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hopital,
     * or with status {@code 400 (Bad Request)} if the hopital is not valid,
     * or with status {@code 404 (Not Found)} if the hopital is not found,
     * or with status {@code 500 (Internal Server Error)} if the hopital couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/hopitals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Hopital> partialUpdateHopital(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Hopital hopital
    ) throws URISyntaxException {
        log.debug("REST request to partial update Hopital partially : {}, {}", id, hopital);
        if (hopital.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hopital.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hopitalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Hopital> result = hopitalRepository
            .findById(hopital.getId())
            .map(existingHopital -> {
                if (hopital.getNomHop() != null) {
                    existingHopital.setNomHop(hopital.getNomHop());
                }

                return existingHopital;
            })
            .map(hopitalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, hopital.getId().toString())
        );
    }

    /**
     * {@code GET  /hopitals} : get all the hopitals.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hopitals in body.
     */
    @GetMapping("/hopitals")
    public ResponseEntity<List<Hopital>> getAllHopitals(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Hopitals");
        Page<Hopital> page = hopitalRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /hopitals/:id} : get the "id" hopital.
     *
     * @param id the id of the hopital to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the hopital, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hopitals/{id}")
    public ResponseEntity<Hopital> getHopital(@PathVariable Long id) {
        log.debug("REST request to get Hopital : {}", id);
        Optional<Hopital> hopital = hopitalRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(hopital);
    }

    /**
     * {@code DELETE  /hopitals/:id} : delete the "id" hopital.
     *
     * @param id the id of the hopital to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hopitals/{id}")
    public ResponseEntity<Void> deleteHopital(@PathVariable Long id) {
        log.debug("REST request to delete Hopital : {}", id);
        hopitalRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
